import { Injectable, UnauthorizedException, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import * as bcrypt from 'bcrypt';
import { EmailService } from '../email/email.service';
import { PasswordResetService } from './password-reset.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private emailService: EmailService,
    private passwordResetService: PasswordResetService,
  ) {}

  async register(registerDto: RegisterDto) {
    try {
      // Check if user already exists
      const existingUser = await this.prisma.user.findUnique({
        where: { email: registerDto.email },
      });

      if (existingUser) {
        throw new UnauthorizedException('Email already exists');
      }

      const hashedPassword = await bcrypt.hash(registerDto.password, 10);
      const user = await this.prisma.user.create({
        data: {
          email: registerDto.email,
          password: hashedPassword,
          name: registerDto.name,
          phone: registerDto.phone,
        },
      });
      // Send welcome email asynchronously (don't wait for it to complete)
      this.emailService.sendWelcomeEmail(user.email, user.name)
        .catch(error => {
          console.error('Failed to send welcome email:', error);
        });

      return this.generateTokens(user.id, user.email, user.role);
    } catch (error) {
      console.error('Registration error:', error);
      // If database connection fails, provide a more helpful error
      if (error.code === 'P1001') {
        throw new UnauthorizedException('Database connection failed. Please try again later.');
      }
      throw error;
    }
  }

  async login(loginDto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordMatching = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordMatching) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateTokens(user.id, user.email, user.role);
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const result = await this.passwordResetService.createPasswordResetToken(forgotPasswordDto.email);
    return { message: result };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const hashedPassword = await bcrypt.hash(resetPasswordDto.password, 10);
    await this.passwordResetService.resetPassword(resetPasswordDto.token, hashedPassword);
    return { message: 'Password has been successfully reset' };
  }

  private async generateTokens(userId: number, email: string, role: string) {
    const payload = { sub: userId, email, role };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
