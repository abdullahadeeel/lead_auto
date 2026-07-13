import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { EmailStatus } from '@prisma/client';
import { PermanentEmailError } from './exceptions';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(EmailService.name);

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    this.transporter = nodemailer.createTransport({
      host: configService.get('MAIL_HOST'),
      port: configService.get('MAIL_PORT'),
      auth: {
        user: configService.get('MAIL_USER'),
        pass: configService.get('MAIL_PASS'),
      },
    });
  }

  async sendEmail(options: {
    to: string;
    subject: string;
    text: string;
    html: string;
    type: string;
    idempotencyKey: string;
    metadata?: any;
  }) {
    const { to, subject, text, html, type, idempotencyKey, metadata } = options;

    // 1. Check idempotency and atomic transition
    let log = await this.prisma.emailLog.findUnique({
      where: { idempotencyKey },
    });

    if (log && log.status === EmailStatus.SENT) {
      this.logger.log(
        `Email with idempotencyKey ${idempotencyKey} already sent. Skipping.`,
      );
      return log;
    }

    // 2. Upsert to ensure record exists and increment attempts
    log = await this.prisma.emailLog.upsert({
      where: { idempotencyKey },
      update: { attempts: { increment: 1 } },
      create: {
        email: to,
        type,
        idempotencyKey,
        status: EmailStatus.PENDING,
        metadata,
        attempts: 1,
      },
    });

    // Re-check status after upsert (in case of race)
    if (log.status === EmailStatus.SENT) {
      return log;
    }

    // 3. Send Email
    try {
      const info = await this.transporter.sendMail({
        from:
          this.configService.get('MAIL_FROM') ||
          '"E-comm" <noreply@example.com>',
        to,
        subject,
        text,
        html,
      });

      // 4. Update Log to SENT
      return await this.prisma.emailLog.update({
        where: { id: log.id },
        data: {
          status: EmailStatus.SENT,
          providerMessageId: info.messageId,
          error: null,
        },
      });
    } catch (error) {
      this.logger.error(
        `Failed to send email to ${to}: ${error.message}`,
        error.stack,
      );

      const isPermanent = this.isPermanentError(error);

      await this.prisma.emailLog.update({
        where: { id: log.id },
        data: {
          status: EmailStatus.FAILED,
          error: error.message,
        },
      });

      if (isPermanent) {
        throw new PermanentEmailError(error.message);
      }
      throw error; // Let BullMQ retry
    }
  }

  private isPermanentError(error: any): boolean {
    // Classify errors based on SMTP codes or message
    // 5xx codes are usually permanent
    const responseCode = error.responseCode;
    if (responseCode >= 500 && responseCode < 600) return true;

    // Specific messages
    const message = error.message.toLowerCase();
    if (message.includes('invalid recipient')) return true;
    if (message.includes('no recipient')) return true;

    return false;
  }
}
