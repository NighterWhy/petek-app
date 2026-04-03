import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async sendVerificationCode(to: string, code: string): Promise<void> {
    const mailOptions = {
      from: `"Petek App" <${process.env.EMAIL_USER}>`,
      to,
      subject: 'Petek Öğrenci Doğrulama Kodu',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h2 style="color: #333;">Öğrenci E-posta Doğrulama</h2>
          <p style="color: #555;">Petek hesabınızı doğrulamak için aşağıdaki kodu kullanın:</p>
          <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #4A90E2; padding: 16px 0;">
            ${code}
          </div>
          <p style="color: #888; font-size: 13px;">Bu kod 3 dakika geçerlidir. Eğer bu isteği siz yapmadıysanız bu e-postayı görmezden gelebilirsiniz.</p>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Verification code sent successfully to ${to}`);
    } catch (error) {
      this.logger.error(`Failed to send verification code to ${to}`, error);
      throw error;
    }
  }
}
