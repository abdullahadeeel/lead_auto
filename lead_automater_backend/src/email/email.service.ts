import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
        host: configService.get("MAIL_HOST"),
        port: configService.get("MAIL_PORT"),
        auth: {
         user: configService.get("MAIL_USER"),
         pass: configService.get("MAIL_PASS")
        }

    })
  }

  async sendVerificationEmail(email: string, token: string) {
    const url = `${this.configService.get('FRONTEND_URL')}/auth/verify-email?token=${token}`;
    
    // In a real app, you would send a proper HTML email
    console.log(`Sending verification email to ${email} with token: ${token}`);
    
    try {
      await this.transporter.sendMail({
        from: '"E-comm Support" <support@example.com>',
        to: email,
        subject: 'Verify your email',
        text: `Please verify your email by clicking: ${url}`,
        html: `<b>Please verify your email by clicking: <a href="${url}">Verify Email</a></b>`,
      });
    } catch (error) {
      console.error('Failed to send email:', error);
      // We don't throw here to avoid failing the queue job immediately if it's just a local dev issue
    }
  }

  async sendLeadGenerationEmail(email: string, productName: string) {
    console.log(`Sending lead generation email to ${email} for product: ${productName}`);
    try {
      await this.transporter.sendMail({
        from: '"E-comm Deals" <deals@example.com>',
        to: email,
        subject: `Special offer on ${productName}!`,
        text: `We noticed you're interested in ${productName}. Here is a special deal for you!`,
        html: `<b>We noticed you're interested in ${productName}. Here is a special deal for you!</b>`,
      });
    } catch (error) {
      console.error('Failed to send lead email:', error);
    }
  }
}
