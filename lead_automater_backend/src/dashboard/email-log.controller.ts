import { Controller, Get, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('dashboard/email-logs')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class EmailLogController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async getEmailLogs() {
    return this.prisma.emailLog.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }
}
