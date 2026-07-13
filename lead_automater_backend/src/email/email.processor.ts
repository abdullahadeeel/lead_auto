import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { EmailService } from './email.service';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PermanentEmailError } from './exceptions';

@Processor('email-queue', {
  concurrency: 5,
  lockDuration: 30000, // 30 seconds
})
export class EmailProcessor extends WorkerHost {
  private readonly logger = new Logger(EmailProcessor.name);

  constructor(
    private emailService: EmailService,
    private configService: ConfigService,
  ) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    const { type, data } = job.data;
    const idempotencyKey = job.id;

    if (!idempotencyKey) {
      this.logger.error(`Job missing ID. Cannot guarantee idempotency.`);
      throw new PermanentEmailError(`Job missing ID.`);
    }

    this.logger.log(
      `Processing ${type} job ${idempotencyKey} (Attempt ${job.attemptsMade + 1})`,
    );

    try {
      switch (type) {
        case 'VERIFY_EMAIL':
          return await this.handleVerifyEmail(data, idempotencyKey);
        case 'LEAD_EMAIL':
          return await this.handleLeadEmail(data, idempotencyKey);
        default:
          this.logger.error(`Unknown job type: ${type}`);
          throw new PermanentEmailError(`Unknown job type: ${type}`);
      }
    } catch (error) {
      if (error instanceof PermanentEmailError) {
        this.logger.error(
          `Permanent failure for job ${job.id}: ${error.message}`,
        );
        // We throw so it goes to FAILED, but with backoff=0 or similar we can stop it
        // Or we can manually move it to failed if we had the queue instance
        throw error;
      }
      this.logger.warn(
        `Transient failure for job ${job.id}: ${error.message}. Retrying...`,
      );
      throw error;
    }
  }

  private async handleVerifyEmail(data: any, idempotencyKey: string) {
    const { email, token } = data;
    const url = `${this.configService.get('FRONTEND_URL')}/auth/verify-email?token=${token}`;

    return await this.emailService.sendEmail({
      to: email,
      subject: 'Verify your email',
      text: `Please verify your email by clicking: ${url}`,
      html: `<b>Please verify your email by clicking: <a href="${url}">Verify Email</a></b>`,
      type: 'VERIFY_EMAIL',
      idempotencyKey,
      metadata: { token },
    });
  }

  private async handleLeadEmail(data: any, idempotencyKey: string) {
    const { email, productName } = data;

    return await this.emailService.sendEmail({
      to: email,
      subject: `Special offer on ${productName}!`,
      text: `We noticed you're interested in ${productName}. Here is a special deal for you!`,
      html: `<b>We noticed you're interested in ${productName}. Here is a special deal for you!</b>`,
      type: 'LEAD_EMAIL',
      idempotencyKey,
      metadata: { productName },
    });
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, error: Error) {
    this.logger.error(`Job ${job.id} failed: ${error.message}`, error.stack);
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    this.logger.log(`Job ${job.id} completed successfully`);
  }
}
