import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { EmailService } from './email.service';

@Processor('email-queue')
export class EmailProcessor extends WorkerHost {
  constructor(private emailService: EmailService) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    const { type, data } = job.data;

    switch (type) {
      case 'VERIFY_EMAIL':
        await this.emailService.sendVerificationEmail(data.email, data.token);
        break;
      case 'LEAD_EMAIL':
        await this.emailService.sendLeadGenerationEmail(data.email, data.productName);
        break;
      default:
        console.log(`Unknown job type: ${type}`);
    }
  }
}
