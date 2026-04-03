import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from './prisma.service';

describe('AuthController', () => {
  let authController: AuthController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        { provide: PrismaService, useValue: { user: { findUnique: jest.fn(), create: jest.fn() } } },
      ],
    }).compile();

    authController = app.get<AuthController>(AuthController);
  });

  describe('register', () => {
    it('should be defined', () => {
      expect(authController).toBeDefined();
    });
  });
});
