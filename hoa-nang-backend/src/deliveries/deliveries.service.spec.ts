import { Test, TestingModule } from '@nestjs/testing';
import { DeliveriesService } from './deliveries.service';
import { PrismaService } from '../prisma.service';

describe('DeliveriesService', () => {
  let service: DeliveriesService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeliveriesService,
        {
          provide: PrismaService,
          useValue: {
            order: {
              findUnique: jest.fn(),
            },
            user: {
              findUnique: jest.fn(),
            },
            delivery: {
              create: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<DeliveriesService>(DeliveriesService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
