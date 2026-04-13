import { Module } from '@nestjs/common';
import { ListingsController } from './listings.controller';
import { ListingsService } from './listings.service';
import { PrismaService } from './prisma.service';
import { S3Service } from './s3/s3.service';

@Module({
  imports: [],
  controllers: [ListingsController],
  providers: [ListingsService, PrismaService, S3Service],
})
export class ListingsModule {}
