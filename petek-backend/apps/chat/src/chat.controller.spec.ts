import { Test, TestingModule } from '@nestjs/testing';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { PrismaService } from './prisma.service';

describe('ChatController', () => {
  let chatController: ChatController;

  beforeEach(async () => {
    const prismaMock = {
      message: {
        findMany: jest.fn().mockResolvedValue([]),
      },
    };

    const app: TestingModule = await Test.createTestingModule({
      controllers: [ChatController],
      providers: [
        ChatService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    chatController = app.get<ChatController>(ChatController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(chatController.getHello()).toBe('Hello World!');
    });
  });
});
