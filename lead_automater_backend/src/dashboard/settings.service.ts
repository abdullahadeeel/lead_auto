import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  async getSettings() {
    let settings = await this.prisma.systemSettings.findUnique({
      where: { id: 'singleton' },
    });
    if (!settings) {
      settings = await this.prisma.systemSettings.create({
        data: { id: 'singleton', viewThreshold: 3 },
      });
    }
    return settings;
  }

  async updateThreshold(threshold: number) {
    return this.prisma.systemSettings.upsert({
      where: { id: 'singleton' },
      update: { viewThreshold: threshold },
      create: { id: 'singleton', viewThreshold: threshold },
    });
  }
}
