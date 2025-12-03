import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('SMTP_HOST') || 'smtp.gmail.com',
      port: this.configService.get('SMTP_PORT') || 587,
      secure: false,
      auth: {
        user: this.configService.get('SMTP_USER'),
        pass: this.configService.get('SMTP_PASS'),
      },
      tls: {
        rejectUnauthorized: false
      }
    });
  }

  async sendWelcomeEmail(email: string, name: string) {
    const subject = 'Chào mừng đến với Hoa nắng';
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Hoa nắng</h1>
            <p>Ẩm thực truyền thống Việt Nam</p>
          </div>
          <div class="content">
            <h2>Xin chào ${name}!</h2>
            <p>Cảm ơn bạn đã đăng ký tài khoản tại Hoa nắng.</p>
            <p>Tài khoản của bạn đã được tạo thành công. Bây giờ bạn có thể:</p>
            <ul>
              <li>Đặt món ăn trực tuyến</li>
              <li>Theo dõi đơn hàng</li>
              <li>Nhận ưu đãi đặc biệt</li>
              <li>Tham gia chương trình khách hàng thân thiết</li>
            </ul>
            <p>Nếu bạn có bất kỳ câu hỏi nào, đừng ngần ngại liên hệ với chúng tôi.</p>
            <p>Trân trọng,<br>Đội ngũ Hoa nắng</p>
          </div>
          <div class="footer">
            <p>© 2025 Hoa nắng. All rights reserved.</p>
            <p>Email: ${this.configService.get('SMTP_USER')}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    try {
      await this.transporter.sendMail({
        from: `"Hoa nắng" <${this.configService.get('SMTP_USER')}>`,
        to: email,
        subject: subject,
        html: html,
      });
      console.log(`Welcome email sent successfully to ${email}`);
      return true;
    } catch (error) {
      console.error('Failed to send welcome email:', error);
      return false;
    }
  }

  async sendOrderConfirmationEmail(email: string, name: string, orderId: string, orderDetails: any) {
    const subject = `Xác nhận đơn hàng #${orderId}`;
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .order-details { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Hoa nắng</h1>
            <p>Xác nhận đơn hàng</p>
          </div>
          <div class="content">
            <h2>Xin chào ${name}!</h2>
            <p>Cảm ơn bạn đã đặt hàng tại Hoa nắng.</p>
            <div class="order-details">
              <h3>Thông tin đơn hàng #${orderId}</h3>
              <p><strong>Mã đơn hàng:</strong> ${orderId}</p>
              <p><strong>Ngày đặt:</strong> ${new Date().toLocaleDateString('vi-VN')}</p>
              <p><strong>Tổng tiền:</strong> ${orderDetails.totalAmount?.toLocaleString('vi-VN')} VNĐ</p>
            </div>
            <p>Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất để xác nhận đơn hàng.</p>
            <p>Trân trọng,<br>Đội ngũ Hoa nắng</p>
          </div>
          <div class="footer">
            <p>© 2025 Hoa nắng. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    try {
      await this.transporter.sendMail({
        from: `"Hoa nắng" <${this.configService.get('SMTP_USER')}>`,
        to: email,
        subject: subject,
        html: html,
      });
      console.log(`Order confirmation email sent successfully to ${email}`);
      return true;
    } catch (error) {
      console.error('Failed to send order confirmation email:', error);
      return false;
    }
  }

  async sendPasswordResetEmail(email: string, name: string, resetLink: string) {
    const subject = 'Đặt lại mật khẩu - Hoa nắng';
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; color: #856404; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Hoa nắng</h1>
            <p>Đặt lại mật khẩu</p>
          </div>
          <div class="content">
            <h2>Xin chào ${name}!</h2>
            <p>Chúng tôi đã nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.</p>
            <p>Vui lòng nhấp vào nút bên dưới để đặt lại mật khẩu:</p>
            <div style="text-align: center;">
              <a href="${resetLink}" class="button">Đặt lại mật khẩu</a>
            </div>
            <div class="warning">
              <p><strong>Lưu ý:</strong> Liên kết này sẽ hết hạn sau 1 giờ.</p>
              <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
            </div>
            <p>Trân trọng,<br>Đội ngũ Hoa nắng</p>
          </div>
          <div class="footer">
            <p>© 2025 Hoa nắng All rights reserved.</p>
            <p>Email: ${this.configService.get('SMTP_USER')}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    try {
      await this.transporter.sendMail({
        from: `"Hoa nắng" <${this.configService.get('SMTP_USER')}>`,
        to: email,
        subject: subject,
        html: html,
      });
      console.log(`Password reset email sent successfully to ${email}`);
      return true;
    } catch (error) {
      console.error('Failed to send password reset email:', error);
      return false;
    }
  }
}