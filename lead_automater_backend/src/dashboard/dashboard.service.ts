import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getStats() {
    const [userCount, productCount, activityCount] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.product.count(),
      this.prisma.userActivity.count(),
    ]);

    return {
      userCount,
      productCount,
      activityCount,
    };
  }

  async getRecentActivities() {
    return this.prisma.userActivity.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { email: true } },
        product: { select: { name: true } },
      },
    });
  }

  async getUserSummary(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        role: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
        activities: {
          select: {
            id: true,
            type: true,
            createdAt: true,
            product: {
              select: {
                id: true,
                name: true,
                price: true,
              },
            },
          },
        },
      },
    });
  }
}
