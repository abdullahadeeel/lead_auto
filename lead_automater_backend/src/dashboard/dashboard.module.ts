import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { SettingsService } from './settings.service';
import { SettingsController } from './settings.controller';
import { EmailLogController } from './email-log.controller';

@Module({
  providers: [DashboardService, SettingsService],
  controllers: [DashboardController, SettingsController, EmailLogController],
})
export class DashboardModule {}
