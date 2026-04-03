import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SendCodeDto, VerifyCodeDto } from './dto/edu-verification.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    const user = await this.authService.validateUser(dto);
    return this.authService.login(user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('send-edu-code')
  sendEduCode(@Req() req: any, @Body() dto: SendCodeDto) {
    return this.authService.sendEduCode(req.user.userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('verify-edu-code')
  verifyEduCode(@Req() req: any, @Body() dto: VerifyCodeDto) {
    return this.authService.verifyEduCode(req.user.userId, dto);
  }


}
