import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { redisStore } from 'cache-manager-redis-yet';
import { ListingsController } from './listings.controller';
import { ListingsService } from './listings.service';
import { PrismaService } from './prisma.service';
import { S3Service } from './s3/s3.service';

@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: async () => ({
        store: await redisStore({ socket: { host: 'localhost', port: 6379 } }),
        ttl: 600000,
      }),
    }),
    ClientsModule.register([
      {
        name: 'RABBITMQ_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://petek:petek123@127.0.0.1:5673'],
          queue: 'notifications_queue',
          queueOptions: { durable: true },
        },
      },
    ]),
  ],
  controllers: [ListingsController],
  providers: [ListingsService, PrismaService, S3Service],
})
export class ListingsModule {}
