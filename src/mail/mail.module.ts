import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  EmailVerificationModel,
  EmailVerificationSchema,
} from 'src/entity/mail';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: EmailVerificationModel.name, schema: EmailVerificationSchema },
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
