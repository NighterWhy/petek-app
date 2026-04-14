import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import * as path from 'path';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('EMAIL_PASSWORD'),
      },
    });
  }

  async sendListingNotification(toEmail: string, userName: string, listingTitle: string): Promise<void> {
    const logoPath = path.join(__dirname, 'mail', 'assets', 'petek-logo.png');

    await this.transporter.sendMail({
      from: `"Petek" <${this.configService.get<string>('EMAIL_USER')}>`,
      to: toEmail,
      subject: 'Petek: İlanınız Yayında!',
      attachments: [
        {
          filename: 'petek-logo.png',
          path: logoPath,
          cid: 'petek-logo',
        },
      ],
      html: `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Petek - İlanınız Yayında</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f4f7f6;
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      table-layout: fixed;
      background-color: #f4f7f6;
      padding-bottom: 40px;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 10px rgba(0,0,0,0.05);
      margin-top: 40px;
    }
    .header {
      background-color:rgb(255, 255, 255); 
      padding: 25px 20px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      color: #212529;
      font-size: 26px;
      letter-spacing: 2px;
      font-weight: 800;
    }
    .content {
      padding: 35px 30px;
      color: #444444;
      line-height: 1.6;
      font-size: 16px;
    }
    .title-box {
      background-color: #fff8e1;
      border-left: 4px solid #ffffff;
      padding: 18px;
      margin: 25px 0;
      border-radius: 0 6px 6px 0;
    }
    .title-box span {
      font-size: 14px;
      color: #666;
    }
    .title-box strong {
      display: block;
      color: #212529;
      font-size: 20px;
      margin-top: 5px;
    }
    .button-container {
      text-align: center;
      margin-top: 35px;
      margin-bottom: 10px;
    }
    .button {
      background-color: #212529;
      color: #FFC107 !important;
      text-decoration: none;
      padding: 14px 30px;
      border-radius: 6px;
      font-weight: bold;
      font-size: 16px;
      display: inline-block;
    }
    .footer {
      background-color: #f8f9fa;
      padding: 20px;
      text-align: center;
      font-size: 13px;
      color: #888888;
      border-top: 1px solid #eeeeee;
    }
    
    /* Mobil Uyumluluk */
    @media only screen and (max-width: 600px) {
      .container {
        margin-top: 20px;
        border-radius: 0;
      }
      .content {
        padding: 25px 20px;
      }
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      
      <div class="header">
        <img src="cid:petek-logo" alt="Petek" height="56" style="display:block; margin: 0 auto;" />
      </div>
      
      <div class="content">
        <p>Merhaba <b>${userName}</b>,</p>
        <p>Harika haber! Sisteme eklemiş olduğunuz ilan onaylandı ve başarıyla platformda yayına alındı.</p>
        
        <div class="title-box">
          <span>İlan Başlığı:</span>
          <strong>${listingTitle}</strong>
        </div>
        
        <p>Artık diğer öğrenciler ilanınızı görebilir ve platform üzerinden sizinle iletişime geçebilir. Bu sosyal dayanışmaya katkı sağladığınız için teşekkür ederiz.</p>
        
        <div class="button-container">
          <a href="https://petek.app" class="button">İlanı Gör</a>
        </div>
      </div>
      
      <div class="footer">
        <p>Bu otomatik bir mesajdır, lütfen bu e-postayı yanıtlamayınız.</p>
        <p>© 2026 Petek. Atıl kapasiteyi değere dönüştüren optimizasyon motoru.</p>
      </div>
      
    </div>
  </div>
</body>
</html>`,
    });
    this.logger.log(`Listing notification email sent to "${toEmail}" for: "${listingTitle}"`);
  }
}
