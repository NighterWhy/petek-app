import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { SendCodeDto, VerifyCodeDto } from './dto/edu-verification.dto';
import { EmailService } from './email.service';
import { PrismaService } from './prisma.service';
import { RedisService } from './redis.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
    private readonly emailService: EmailService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existing) {
      throw new ConflictException('A user with this email already exists.');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        fullName: dto.fullName,
        role: 'DONOR',
        isEduVerified: false,
      },
    });

    const { passwordHash: _, ...result } = user;
    return result;
  }

  async validateUser(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    const { passwordHash: _, ...result } = user;
    return result;
  }

  login(user: any) {
    const payload = {
      iss: 'petek-frontend-key',
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

  async sendEduCode(userId: string, dto: SendCodeDto): Promise<{ message: string }> {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const redisKey = `edu_code:${userId}`;

    await this.redisService.set(redisKey, code, 180);
    await this.emailService.sendVerificationCode(dto.eduEmail, code);

    return { message: 'Doğrulama kodu e-posta adresinize gönderildi.' };
  }

  async verifyEduCode(userId: string, dto: VerifyCodeDto): Promise<{ message: string }> {
    const redisKey = `edu_code:${userId}`;
    const storedCode = await this.redisService.get(redisKey);

    if (!storedCode || storedCode !== dto.code) {
      throw new BadRequestException('Geçersiz veya süresi dolmuş doğrulama kodu.');
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        role: 'STUDENT',
        isEduVerified: true,
        eduEmail: dto.eduEmail,
      },
    });

    await this.redisService.del(redisKey);

    return { message: 'E-posta başarıyla doğrulandı. Rolünüz STUDENT olarak güncellendi.' };
  }
}
