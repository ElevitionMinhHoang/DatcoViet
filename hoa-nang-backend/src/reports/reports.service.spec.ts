import { Test, TestingModule } from '@nestjs/testing';
import { ReportsService } from './reports.service';
import { PrismaService } from '../prisma.service';

describe('ReportsService', () => {
  let service: ReportsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportsService,
        {
          provide: PrismaService,
          useValue: {
            order: {
              aggregate: jest.fn(),
              count: jest.fn(),
              groupBy: jest.fn(),
            },
            user: {
              count: jest.fn(),
              findMany: jest.fn(),
            },
            orderItem: {
              groupBy: jest.fn(),
            },
            menu: {
                findMany: jest.fn(),
            }
          },
        },
      ],
    }).compile();

    service = module.get<ReportsService>(ReportsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
