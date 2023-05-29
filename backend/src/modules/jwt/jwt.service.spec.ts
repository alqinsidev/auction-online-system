// jwt-auth.service.spec.ts
import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthService } from './jwt.service';

describe('JwtAuthService', () => {
  let jwtAuthService: JwtAuthService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        JwtAuthService,
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn().mockResolvedValue('mockAccessToken'),
            verifyAsync: jest.fn().mockResolvedValue({ userId: 1 }),
          },
        },
      ],
    }).compile();

    jwtAuthService = moduleRef.get<JwtAuthService>(JwtAuthService);
    jwtService = moduleRef.get<JwtService>(JwtService);
  });

  describe('generateToken', () => {
    it('should generate a token', async () => {
      const payload = { userId: 1 };
      const result = await jwtAuthService.generateToken(payload);
      expect(result).toBe('mockAccessToken');
      expect(jwtService.signAsync).toHaveBeenCalledWith(payload);
    });
  });

  describe('verifyToken', () => {
    it('should verify a token', async () => {
      const token = 'mockToken';
      const result = await jwtAuthService.verifyToken(token);
      expect(result).toEqual({ userId: 1 });
      expect(jwtService.verifyAsync).toHaveBeenCalledWith(token);
    });
  });
});
