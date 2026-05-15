import { ActivityType } from '@prisma/client';
import { IsEnum, IsString } from 'class-validator';

export class TrackActivityDto {
  @IsString()
  productId: string;

  @IsEnum(ActivityType)
  type: ActivityType;
}
