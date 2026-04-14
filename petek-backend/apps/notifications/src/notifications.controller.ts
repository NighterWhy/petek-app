import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { MailService } from './mail/mail.service';

@Controller()
export class NotificationsController {
  constructor(private readonly mailService: MailService) {}

  @EventPattern('listing_created')
  async handleListingCreated(@Payload() data: any) {
    console.log('New listing received asynchronously:', data);
    await this.mailService.sendListingNotification(data.user.email, data.user.fullName, data.title);
  }
}
