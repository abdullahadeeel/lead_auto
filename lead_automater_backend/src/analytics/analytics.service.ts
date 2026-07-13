import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TrackActivityDto } from './dto/track-activity.dto';
import { ActivityType } from '@prisma/client';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class AnalyticsService {
  constructor(
    private prisma: PrismaService,
    @InjectQueue('email-queue') private emailQueue: Queue,
  ) {}

  async trackActivity(userId: string, dto: TrackActivityDto) {
    // Validate product existence
    const product = await this.prisma.product.findUnique({
      where: { id: dto.productId },
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${dto.productId} not found`);
    }

    const activity = await this.prisma.userActivity.create({
      data: {
        userId,
        productId: dto.productId,
        type: dto.type,
      },
      select: {
        id: true,
        userId: true,
        productId: true,
        type: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
        product: {
          select: {
            id: true,
            name: true,
            price: true,
          },
        },
      },
    });

    // Get dynamic threshold
    const settings = await this.prisma.systemSettings.findUnique({
      where: { id: 'singleton' },
    });
    const threshold = settings?.viewThreshold || 3;

    if (dto.type === ActivityType.VIEW) {
      const viewCount = await this.prisma.userActivity.count({
        where: {
          userId,
          productId: dto.productId,
          type: ActivityType.VIEW,
        },
      });

      if (viewCount >= threshold) {
        await this.triggerLeadEmail(activity.user.email, activity.product.name);
      }
    } else if (dto.type === ActivityType.LIKE) {
      // Now also use the threshold for LIKEs to avoid excessive emails
      const likeCount = await this.prisma.userActivity.count({
        where: {
          userId,
          productId: dto.productId,
          type: ActivityType.LIKE,
        },
      });

      if (likeCount >= threshold) {
        await this.triggerLeadEmail(activity.user.email, activity.product.name);
      }
    }

    return activity;
  }

  private async triggerLeadEmail(email: string, productName: string) {
    // Add to queue with deterministic jobId
    // Using a combination of email and productName to avoid duplicate leads for the same product
    const jobId = `lead-email:${email}:${productName.replace(/\s+/g, '-').toLowerCase()}`;

    await this.emailQueue.add(
      'send-email',
      {
        type: 'LEAD_EMAIL',
        data: {
          email,
          productName,
        },
      },
      {
        jobId,
      },
    );
  }

  async getRecommendations(userId: string) {
    // Basic recommendation logic: products from categories the user has liked or viewed most
    const userActivities = await this.prisma.userActivity.findMany({
      where: { userId },
      select: {
        product: {
          select: {
            categoryId: true,
          },
        },
      },
    });

    const categoryCounts = new Map<string, number>();
    userActivities.forEach((act) => {
      if (act.product?.categoryId) {
        const catId = act.product.categoryId;
        categoryCounts.set(catId, (categoryCounts.get(catId) || 0) + 1);
      }
    });

    // Sort categories by engagement
    const topCategories = Array.from(categoryCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([catId]) => catId);

    // Fetch products from top categories that user hasn't engaged with much yet
    return this.prisma.product.findMany({
      where: {
        categoryId: { in: topCategories },
        // exclude already interacted? maybe not
      },
      take: 5,
    });
  }
}
