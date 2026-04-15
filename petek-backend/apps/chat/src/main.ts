import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ChatModule } from './chat.module';

async function bootstrap() {
  const app = await NestFactory.create(ChatModule);

  const config = new DocumentBuilder()
    .setTitle('Petek - Chat Service')
    .setDescription('Petek platformu için anlık mesajlaşma servisi API dokümantasyonu')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/chat', app, document);

  await app.listen(process.env.CHAT_PORT ?? 3002);
}
bootstrap();
