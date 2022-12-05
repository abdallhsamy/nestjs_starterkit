import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Request,
  Res,
  HttpStatus,
  UseGuards, Render
} from "@nestjs/common";
import { AuthV1Service } from '@src/auth/services/auth-v1.service';
import { RegisterV1Dto } from '@src/auth/dto/register-v1.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LoginV1Dto } from '@src/auth/dto/login-v1.dto';
import { ResetPasswordV1Dto } from '@src/auth/dto/reset-password-v1.dto';
import { Response } from 'express';
import { ForgotPasswordV1Dto } from '../dto/forgot-password-v1.dto';
import { JwtAuthGuard } from "@src/common/guards/jwt-auth.guard";

@ApiBearerAuth()
@ApiTags('auth')
@Controller({ path: 'auth', version: '1' })
@Controller('auth')
export class AuthV1Controller {
  constructor(private readonly service: AuthV1Service) {}

  @Post('register')
  @Render('email_verification.mail')
  async register(@Body() dto: RegisterV1Dto, @Res() res: Response) {
    await this.service.register(dto);

    return res.status(HttpStatus.CREATED).json({ message : 'account registered successfully, please check your email' });
  }

  @Post('login')
  async login(@Body() dto: LoginV1Dto, @Res() res: Response) {
    const data = await this.service.login(dto);

    return res.status(HttpStatus.OK).json(data);
  }

  @Get('verify-email')
  async verify(@Request() req: any, @Res() res: Response) {
    await this.service.verify(req.user);

    return res.status(HttpStatus.OK).json({ message: 'email verified successfully' });
  }

  @Get('resend-verification/:email')
  async resendVerification(@Param('email') email: string, @Res() res: Response) {
    await this.service.resendVerification(email);

    return res.status(HttpStatus.OK).json({ message: 'please check your mailboc' });
  }

  @Post('forgot-password')
  async forgotPassword(@Body() forgetPasswordDto: ForgotPasswordV1Dto, @Res() res: Response) {
    await this.service.forgotPassword(forgetPasswordDto);

    return res.status(HttpStatus.OK).json({ message: 'please check your email' });
  }

  @Post('reset-password')
  async resetPassword(@Body() dto: ResetPasswordV1Dto, @Request() req: any, @Res() res: Response) {
    await this.service.resetPassword(dto);

    return res.status(HttpStatus.OK).json({ message : 'password changed successfully' });
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Request() req: any, @Res() res: Response) {
    await this.service.logout();

    return res.status(HttpStatus.OK).json({ message : 'successfully logged out' });
  }
}
