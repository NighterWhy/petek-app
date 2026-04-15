import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ListingsModule } from './listings.module';

async function bootstrap() {
  const app = await NestFactory.create(ListingsModule);

  const config = new DocumentBuilder()
    .setTitle('Petek - Listings Service')
    .setDescription('Petek platformu için ilan yönetimi servisi API dokümantasyonu')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/listings', app, document);

  await app.listen(process.env.LISTINGS_PORT ?? 3001);
}
bootstrap();
