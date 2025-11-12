import { Test, TestingModule } from '@nestjs/testing';
import { MenusService } from './menus.service';
import { PrismaService } from '../prisma.service';

describe('MenusService', () => {
  let service: MenusService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MenusService,
        {
          provide: PrismaService,
          useValue: {
            menu: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<MenusService>(MenusService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
