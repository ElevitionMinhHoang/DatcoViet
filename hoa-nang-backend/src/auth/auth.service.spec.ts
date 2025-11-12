import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma.service';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              create: jest.fn(),
              findUnique: jest.fn(),
            },
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const registerDto = { email: 'test@example.com', password: 'password' };
      const hashedPassword = await bcrypt.hash(registerDto.password, 10);
      const user = { id: 1, email: registerDto.email, password: hashedPassword, role: Role.USER };

      (prisma.user.create as jest.Mock).mockResolvedValue(user);
      (jwtService.signAsync as jest.Mock).mockResolvedValue('token');

      const result = await service.register(registerDto);

      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          email: registerDto.email,
          password: expect.any(String),
        },
      });
      expect(jwtService.signAsync).toHaveBeenCalledWith({ sub: user.id, email: user.email, role: user.role });
      expect(result).toEqual({ access_token: 'token' });
    });
  });

  describe('login', () => {
    it('should login an existing user', async () => {
      const loginDto = { email: 'test@example.com', password: 'password' };
      const hashedPassword = await bcrypt.hash(loginDto.password, 10);
      const user = { id: 1, email: loginDto.email, password: hashedPassword, role: Role.USER };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(user);
      (jwtService.signAsync as jest.Mock).mockResolvedValue('token');

      const result = await service.login(loginDto);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email: loginDto.email } });
      expect(jwtService.signAsync).toHaveBeenCalledWith({ sub: user.id, email: user.email, role: user.role });
      expect(result).toEqual({ access_token: 'token' });
    });

    it('should throw an error for invalid credentials', async () => {
        const loginDto = { email: 'test@example.com', password: 'password' };

        (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

        await expect(service.login(loginDto)).rejects.toThrow('Invalid credentials');
    });
  });
});
