import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  private transporter: nodemailer.Transporter;

  constructor() {
    // Initialize nodemailer with Mailtrap configuration from .env
    const host = process.env.MAIL_HOST || 'sandbox.smtp.mailtrap.io';
    const port = parseInt(process.env.MAIL_PORT || '587', 10);
    const user = process.env.MAIL_USER;
    const pass = process.env.MAIL_PASSWORD;

    if (!user || !pass) {
      this.logger.warn('⚠️ Email credentials not found in environment variables. Email sending will fail.');
    }

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465, // true for 465, false for other ports
      auth: {
        user,
        pass,
      },
    });

    this.logger.log(`✅ Email transporter initialized with ${host}:${port}`);
  }

  /**
   * Send email verification link to user
   * @param email - User's email address
   * @param token - Verification token
   * @param userType - 'client' or 'admin'
   */
  async sendVerificationEmail(email: string, token: string, userType: 'client' | 'admin' = 'client') {
    this.logger.log(`Sending verification email to ${email} (${userType})`);

    const frontendUrl = userType === 'client' 
      ? process.env.FRONTEND_URL || 'http://localhost:3001'
      : process.env.ADMIN_URL || 'http://localhost:3002';

    const verificationLink = `${frontendUrl}/verify-email?token=${token}`;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🍁 Canada Immigration Services</h1>
              <p>Email Verification</p>
            </div>
            <div class="content">
              <h2>Welcome! Please verify your email</h2>
              <p>Thank you for registering with Canada Immigration Services. To complete your registration, please verify your email address by clicking the button below:</p>
              <div style="text-align: center;">
                <a href="${verificationLink}" class="button">Verify Email Address</a>
              </div>
              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #667eea;">${verificationLink}</p>
              <p><strong>This link will expire in 24 hours.</strong></p>
              <p>If you didn't create an account, you can safely ignore this email.</p>
            </div>
            <div class="footer">
              <p>© 2025 Canada Immigration Services. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    try {
      await this.transporter.sendMail({
        from: process.env.MAIL_FROM || '"Canada Immigration" <noreply@immigration.ca>',
        to: email,
        subject: '✅ Verify Your Email - Canada Immigration Services',
        html: htmlContent,
      });

      this.logger.log(`✅ Verification email sent successfully to ${email}`);
      return { success: true };
    } catch (error) {
      this.logger.error(`❌ Failed to send verification email to ${email}:`, error);
      throw error;
    }
  }

  /**
   * Send password reset link to user
   * @param email - User's email address
   * @param token - Reset token
   * @param userType - 'client' or 'admin'
   */
  async sendPasswordResetEmail(email: string, token: string, userType: 'client' | 'admin' = 'client') {
    this.logger.log(`Sending password reset email to ${email} (${userType})`);

    const frontendUrl = userType === 'client' 
      ? process.env.FRONTEND_URL || 'http://localhost:3001'
      : process.env.ADMIN_URL || 'http://localhost:3002';

    const resetLink = `${frontendUrl}/reset-password?token=${token}`;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #f5576c; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 10px; margin: 15px 0; }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 Password Reset Request</h1>
              <p>Canada Immigration Services</p>
            </div>
            <div class="content">
              <h2>Reset Your Password</h2>
              <p>We received a request to reset your password. Click the button below to create a new password:</p>
              <div style="text-align: center;">
                <a href="${resetLink}" class="button">Reset Password</a>
              </div>
              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #f5576c;">${resetLink}</p>
              <div class="warning">
                <strong>⚠️ Security Notice:</strong>
                <ul>
                  <li>This link will expire in 1 hour</li>
                  <li>If you didn't request this, please ignore this email</li>
                  <li>Your password will remain unchanged until you create a new one</li>
                </ul>
              </div>
            </div>
            <div class="footer">
              <p>© 2025 Canada Immigration Services. All rights reserved.</p>
              <p>This is an automated message, please do not reply.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    try {
      await this.transporter.sendMail({
        from: process.env.MAIL_FROM || '"Canada Immigration" <noreply@immigration.ca>',
        to: email,
        subject: '🔐 Reset Your Password - Canada Immigration Services',
        html: htmlContent,
      });

      this.logger.log(`✅ Password reset email sent successfully to ${email}`);
      return { success: true };
    } catch (error) {
      this.logger.error(`❌ Failed to send password reset email to ${email}:`, error);
      throw error;
    }
  }

  /**
   * Send email verification success notification
   */
  async sendVerificationSuccessEmail(email: string, name: string, userType: 'client' | 'admin' = 'client') {
    this.logger.log(`Sending verification success email to ${email}`);

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .success-icon { font-size: 48px; text-align: center; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✅ Email Verified!</h1>
            </div>
            <div class="content">
              <div class="success-icon">🎉</div>
              <h2>Welcome, ${name}!</h2>
              <p>Your email has been successfully verified. You now have full access to Canada Immigration Services.</p>
              <p><strong>What's next?</strong></p>
              <ul>
                <li>Complete your profile information</li>
                <li>Submit your immigration application</li>
                <li>Track your application status</li>
                <li>Contact our support team anytime</li>
              </ul>
              <p>We're here to help you throughout your immigration journey to Canada!</p>
            </div>
            <div class="footer">
              <p>© 2025 Canada Immigration Services. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    try {
      await this.transporter.sendMail({
        from: process.env.MAIL_FROM || '"Canada Immigration" <noreply@immigration.ca>',
        to: email,
        subject: '🎉 Email Verified - Welcome to Canada Immigration Services',
        html: htmlContent,
      });

      this.logger.log(`✅ Verification success email sent to ${email}`);
      return { success: true };
    } catch (error) {
      this.logger.error(`❌ Failed to send verification success email:`, error);
      throw error;
    }
  }
}