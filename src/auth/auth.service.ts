import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Types } from 'mongoose';
//
import { MailService } from 'src/mail/mail.service';
import { UsersService } from 'src/users/users.service';
import { UserDocument } from 'src/entity/users';
import { throwClientError, throwError } from 'src/utils/response.util';
import { logger } from 'src/utils/logger.util';
import { EmailVerificationDocument } from 'src/entity/mail';
import {
  userChangePasswordValidatorSchema,
  userLoginValidatorSchema,
  userPasswordResetValidatorSchema,
  userValidatorSchema,
} from 'src/validators/users';
import { PasswordService } from './password/password.service';
import { PasswordDocument } from 'src/entity/password';
import { CartService } from 'src/cart/cart.service';
import { CartDocument } from 'src/entity/carts';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly passwordService: PasswordService,
    private jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly cartService: CartService,
  ) {}

  public async signUp(
    body: UserDocument & { password: string },
  ): Promise<UserDocument> {
    // validate payload
    userValidatorSchema.parse(body);
    const count = await this.userService.count({ email: body.email });
    if (count > 0) throwClientError('Email already in use');
    const user = await this.userService.create(body);
    const hashedPassword = await this.passwordService.hashPassword(
      body.password,
    );
    await this.passwordService.create({
      user: user._id,
      password: hashedPassword,
    } as PasswordDocument);
    //
    await this.cartService.create({ user: user?.id } as CartDocument);

    return this.userService.findById(user?.id);
  }

  async login(
    email: string,
    password: string,
  ): Promise<{ user: UserDocument; token: string }> {
    logger.info('>>> Attempting to login: ', email);
    // validate payload
    userLoginValidatorSchema.parse({ email, password });
    const user = await this.userService.findOne({ email });

    if (!user) throwClientError('Incorrect credentials');

    const userId = new Types.ObjectId(user?.id);
    const pwd = await this.passwordService.findOne({ user: userId });

    const isMatch = await this.passwordService.isMatch(password, pwd.password);

    if (!isMatch) throwClientError('Incorrect credentials');

    const jwtPayload = { email, sub: user?.id, roles: user?.roles };
    const access_token = this.jwtService.sign(jwtPayload);

    return { user, token: access_token };
  }

  async resetPassword(body: UserDocument): Promise<{ message: string }> {
    logger.info('>>> Attempting to reset password: ', body);

    const { email } = body;

    //   validate reset password payload
    userPasswordResetValidatorSchema.parse(body);

    const user = await this.userService.findOne({ email });
    if (!user) throwError('Account not found', HttpStatus.NOT_FOUND);

    // save verification details
    const verificationInfo = {
      email,
      verificationCode: this.mailService.getVerificationCode(),
      expiresAt: this.mailService.getExpiresAt() as any,
      used: false,
    };
    await this.mailService.create(
      verificationInfo as EmailVerificationDocument,
    );

    // send reset details
    // const sentEmail = await this.sendConfirmationEmail(user);

    return { message: `Email verification token has been sent to ${email}` };
  }

  async changePassword(
    body: EmailVerificationDocument & { newPassword: string },
  ): Promise<{ message: string }> {
    logger.info('>>> Attempting to change password: ', body);

    const { email, verificationCode, newPassword } = body;

    // TODO: validate change password
    userChangePasswordValidatorSchema.parse(body);

    const user = await this.userService.findOne({ email });
    if (!user) throwClientError('Account not found');

    // save credentials to database
    const emailVerification = await this.mailService.findOne({
      email,
      verificationCode,
      used: false,
    });

    if (!emailVerification)
      throwClientError('The verification code has been used');

    const isExpired = this.mailService.isVerificationCodeExpired(
      emailVerification.expiresAt as any,
    );

    if (isExpired) {
      throwClientError('Token expired!');
    }

    // save credentials to database
    const savedPassword = await this.passwordService.findOne({
      user: user._id,
    });

    // hash the new password
    const hashedPassword = await this.passwordService.hashPassword(newPassword);
    // update password to a new one
    await this.passwordService.updateById(
      savedPassword.id,
      { password: hashedPassword },
      { user: user._id },
    );

    // invalidate the token
    await this.mailService.updateById(
      emailVerification._id,
      { used: true },
      { email, verificationCode },
    );

    // notify the client of the password changed
    // await this.sendConfirmedEmail(user);

    return { message: 'Password reset was successful!' };
  }

  async validateUser(email: string, password: string): Promise<UserDocument> {
    const user = await this.userService.findOne({ email });
    if (!user) throwClientError('Account not found');
    const savedPassword = await this.passwordService.findOne({
      user: user._id,
    });
    if (savedPassword?.password !== password)
      throwClientError('Incorrect email and password combination');
    return user;
  }
}
