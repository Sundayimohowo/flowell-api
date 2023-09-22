import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { EmailVerificationSchema } from 'src/entity/mail';
import { Collections } from 'src/utils/enums/collections.enum';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Collections.emailVerification, schema: EmailVerificationSchema },
    ]),
    // MailgunModule.forRoot({
    //   key: config.mailgunApiKey,
    //   username: 'api',
    // }),
  ],
  providers: [MailService],
  exports: [MailService],
  controllers: [MailController],
})
export class MailModule {}
