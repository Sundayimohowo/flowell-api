import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PasswordModule } from './password/password.module';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { config } from 'src/config';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [
    UsersModule,
    PasswordModule,
    JwtModule.register({
      secret: config.jwtSecret,
      signOptions: { expiresIn: '60s' },
    }),
    MailModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [],
})
export class AuthModule {}
