import { IsEmail, IsString, Length, Matches } from 'class-validator';

export class SendCodeDto {
  @IsEmail()
  @Matches(/^[a-zA-Z0-9._%+-]+@([a-zA-Z0-9.-]+\.)?edu\.tr$/, {
    message: 'Geçerli bir .edu.tr uzantılı e-posta giriniz',
  })
  eduEmail: string;
}

export class VerifyCodeDto {
  @IsEmail()
  eduEmail: string;

  @IsString()
  @Length(6, 6)
  code: string;
}
