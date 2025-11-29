import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
      // Add connection pool configuration for Supabase
      log: ['query', 'info', 'warn', 'error'],
    });
  }

  async onModuleInit() {
    let retries = 5;
    while (retries > 0) {
      try {
        await this.$connect();
        this.logger.log('Successfully connected to database');
        break;
      } catch (error) {
        this.logger.error(`Failed to connect to database. Retries left: ${retries - 1}`, error);
        retries--;
        if (retries === 0) {
          this.logger.error('Could not connect to database after all retries');
          throw error;
        }
        await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds before retry
      }
    }
  }
}
