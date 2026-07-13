import { Controller, Get, Query, UseGuards } from '@nestjs/common';
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
  async getEmailLogs(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '50',
  ) {
    const parsedPage = Math.max(1, parseInt(page, 10) || 1);
    const parsedLimit = Math.max(1, Math.min(100, parseInt(limit, 10) || 50));
    const skip = (parsedPage - 1) * parsedLimit;

    return this.prisma.emailLog.findMany({
      skip,
      take: parsedLimit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        type: true,
        status: true,
        attempts: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
}
