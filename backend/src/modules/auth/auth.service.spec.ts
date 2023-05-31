// auth.service.spec.ts
import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtAuthService } from '../jwt/jwt.service';
import { Repository, Timestamp } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { LoginDTO } from './dto/login.dto';
import * as bcryptHelpers from '../../helpers/bcrypt.helper';
import { HttpStatus } from '@nestjs/common';

describe('AuthService', () => {
  let authService: AuthService;
  let userRepository: Repository<User>;
  let jwtAuthService: JwtAuthService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtAuthService,
          useValue: {
            generateToken: jest.fn().mockReturnValue('mockAccessToken'),
          },
        },
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    authService = moduleRef.get<AuthService>(AuthService);
    userRepository = moduleRef.get<Repository<User>>(getRepositoryToken(User));
    jwtAuthService = moduleRef.get<JwtAuthService>(JwtAuthService);
  });

  describe('login', () => {
    it('should success return auth data', async () => {
      const loginPayload: LoginDTO = {
        email: 'padlanalqinsi@gmail.com',
        password: 'padlan123',
      };
      const user: User = new User();
      user.id = 'user_1';
      user.full_name = 'padlan';
      user.email = 'padlanalqinsi@gmail.com';
      user.password = 'mockpassword';
      user.created_at = '2023-05-29T09:29:48.282Z' as unknown as Timestamp;
      user.deposit = {
        user_id: 'user_1',
        id: '1',
        amount: 1000,
        updated_at: '2023-05-29T09:29:48.282Z' as unknown as Timestamp,
      };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);
      jest.spyOn(bcryptHelpers, 'compareHash').mockResolvedValueOnce(true);

      jest
        .spyOn(jwtAuthService, 'generateToken')
        .mockResolvedValue('mockAccessToken');

      const result = await authService.login(loginPayload);


      expect(result.accessToken).toBe('mockAccessToken');
      expect(result.userData).toEqual({
        id: 'user_1',
        full_name: 'padlan',
        email: 'padlanalqinsi@gmail.com',
        deposit: {
          user_id: 'user_1',
          id: '1',
          amount: 1000,
          updated_at: '2023-05-29T09:29:48.282Z',
        },
      });
    });

    it('should throw an error if the user is not found', async () => {

      const loginDto: LoginDTO = {
        email: 'test@example.com',
        password: 'password123',
      };

      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(undefined);

      let error: Error;
      try {
        await authService.login(loginDto);
      } catch (err) {
        error = err;
      }

      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('User not found');
    });

    it('should throw an error if the password does not match', async () => {

      const loginDto: LoginDTO = {
        email: 'test@example.com',
        password: 'password123',
      };

      const user = new User();
      user.id = '1';
      user.full_name = 'Wrong User';
      user.email = 'wrong@example.com';
      user.password = 'wrong pass';

      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(user);

      jest.spyOn(bcryptHelpers, 'compareHash').mockResolvedValueOnce(false);


      let error: Error;
      try {
        await authService.login(loginDto);
      } catch (err) {
        error = err;
      }

      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('Password not match');
    });
  });
});
