import { IsEmail, IsString, Length, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendCodeDto {
  @ApiProperty({
    description: '.edu.tr uzantılı kurumsal üniversite e-posta adresi',
    example: 'ogrenci@istanbul.edu.tr',
  })
  @IsEmail()
  @Matches(/^[a-zA-Z0-9._%+-]+@([a-zA-Z0-9.-]+\.)?edu\.tr$/, {
    message: 'Geçerli bir .edu.tr uzantılı e-posta giriniz',
  })
  eduEmail: string;
}

export class VerifyCodeDto {
  @ApiProperty({
    description: '.edu.tr uzantılı kurumsal üniversite e-posta adresi',
    example: 'ogrenci@istanbul.edu.tr',
  })
  @IsEmail()
  eduEmail: string;

  @ApiProperty({
    description: 'E-posta ile gönderilen 6 haneli doğrulama kodu',
    example: '123456',
  })
  @IsString()
  @Length(6, 6)
  code: string;
}
