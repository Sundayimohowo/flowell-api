import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UserDocument } from 'src/entity/users';
import { createDataResponse } from 'src/utils/response.util';
import { EmailVerificationDocument } from 'src/entity/mail';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign_up')
  async signUp(@Body() body: UserDocument & { password: string }) {
    return createDataResponse(this.authService.signUp(body));
  }

  //   @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Body() user: { email: string; password: string }) {
    return createDataResponse(
      this.authService.login(user?.email, user?.password),
    );
  }

  @Post('reset_password')
  async resetPassword(@Body() body: UserDocument) {
    return createDataResponse(this.authService.resetPassword(body));
  }

  @Post('change_password')
  async changePassword(
    @Body()
    body: EmailVerificationDocument & {
      newPassword: string;
    },
  ) {
    return createDataResponse(this.authService.changePassword(body));
  }
}
