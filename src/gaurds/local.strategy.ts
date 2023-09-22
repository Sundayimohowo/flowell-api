import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from 'src/auth/auth.service';
import { UserDocument } from 'src/entity/users';
import { logger } from 'src/utils/logger.util';
import { userLoginValidatorSchema } from 'src/validators/users';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<UserDocument> {
    logger.info('>>> Calling guard: ', email, password);
    userLoginValidatorSchema.parse({ email, password });
    const user = await this.authService.validateUser(email, password);
    if (!user)
      throw new UnauthorizedException('Invalid email and password combination');
    logger.info('>>> Found user: ', user);
    return user;
  }
}
