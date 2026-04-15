import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ description: 'Kullanıcının e-posta adresi', example: 'kullanici@istanbul.edu.tr' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Kullanıcının şifresi', example: 'sifre123' })
  @IsString()
  password: string;
}
