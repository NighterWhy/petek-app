import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ description: 'Kullanıcının e-posta adresi', example: 'yeni.kullanici@istanbul.edu.tr' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Kullanıcının şifresi (en az 6 karakter)', example: 'sifre123' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ description: 'Kullanıcının tam adı ve soyadı', example: 'Ahmet Yılmaz' })
  @IsString()
  fullName: string;
}
