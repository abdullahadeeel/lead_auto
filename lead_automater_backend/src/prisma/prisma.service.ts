import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(private configService: ConfigService) {
    const connectionString = configService.get<string>('DATABASE_URL');

    // Explicitly configure connection pool properties to prevent resource exhaustion
    const pool = new Pool({
      connectionString,
      max: 100, // Limit connection pool to 100 connections
      connectionTimeoutMillis: 5000, // Terminate request if connection isn't acquired in 5s
      idleTimeoutMillis: 30000, // Terminate idle connections after 30s to release resources
    });

    const adapter = new PrismaPg(pool);
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
