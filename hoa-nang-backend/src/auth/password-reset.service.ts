// Password reset service with case-insensitive email lookup
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { randomBytes } from 'crypto';
// Simple date calculation without date-fns dependency
const addHours = (date: Date, hours: number): Date => {
  const result = new Date(date);
  result.setHours(result.getHours() + hours);
  return result;
};
import { EmailService } from '../email/email.service';

@Injectable()
export class PasswordResetService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
  ) {}

  async createPasswordResetToken(email: string): Promise<string> {
    // Find user by email (case-insensitive)
    const user = await this.prisma.user.findFirst({
      where: { email: { equals: email, mode: 'insensitive' } },
    });

    console.log(`Looking up user with email ${email}, found:`, user ? user.email : 'none');

    if (!user) {
      // Don't reveal if user exists or not for security
      return 'If an account with that email exists, a password reset link has been sent.';
    }

    // Generate random token
    const token = randomBytes(32).toString('hex');
    const expiresAt = addHours(new Date(), 1); // Token expires in 1 hour

    // Delete any existing tokens for this user
    await this.prisma.passwordResetToken.deleteMany({
      where: { userId: user.id },
    });

    // Create new token
    await this.prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token,
        expiresAt,
      },
    });

    // Send email with reset link
    console.log('FRONTEND_URL:', process.env.FRONTEND_URL);
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    console.log(`Sending password reset email to ${user.email} with link ${resetLink}`);
    
    try {
      await this.emailService.sendPasswordResetEmail(
        user.email,
        user.name,
        resetLink,
      );
      console.log('Password reset email sent successfully');
    } catch (error) {
      console.error('Failed to send password reset email:', error);
      // Still return same message for security
    }

    return 'If an account with that email exists, a password reset link has been sent.';
  }

  async validatePasswordResetToken(token: string): Promise<{ userId: number; email: string }> {
    console.log(`Validating token: ${token}`);
    const resetToken = await this.prisma.passwordResetToken.findUnique({
      where: { token },
      include: { user: true },
    });

    console.log('Found resetToken:', resetToken);
    if (!resetToken) {
      console.log('Token not found');
      throw new BadRequestException('Invalid or expired password reset token');
    }

    console.log('Token expiresAt:', resetToken.expiresAt, 'Current time:', new Date());
    if (resetToken.expiresAt < new Date()) {
      console.log('Token expired');
      // Clean up expired token
      await this.prisma.passwordResetToken.delete({
        where: { id: resetToken.id },
      });
      throw new BadRequestException('Password reset token has expired');
    }

    console.log('Token valid for user:', resetToken.userId);
    return {
      userId: resetToken.userId,
      email: resetToken.user.email,
    };
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const { userId } = await this.validatePasswordResetToken(token);

    // Update user password
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        password: newPassword, // Note: In production, this should be hashed
        passwordChangedAt: new Date(),
        passwordChangeCount: {
          increment: 1,
        },
      },
    });

    // Delete the used token
    await this.prisma.passwordResetToken.delete({
      where: { token },
    });
  }

  async cleanupExpiredTokens(): Promise<void> {
    await this.prisma.passwordResetToken.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });
  }
}