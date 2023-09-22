import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DateTime } from 'luxon';
import { Model } from 'mongoose';
import { generate as voucherCodeGenerator } from 'voucher-code-generator';
//
import { MailgunMessageData } from 'mailgun.js';
import { MongooseGenericRepository } from 'src/utils/repository/generic.repository';
import { EmailVerificationDocument } from 'src/entity/mail';
// import { config } from 'src/config';
import { throwError } from 'src/utils/response.util';
import { Collections } from 'src/utils/enums/collections.enum';

@Injectable()
export class MailService extends MongooseGenericRepository<EmailVerificationDocument> {
  constructor(
    @InjectModel(Collections.emailVerification)
    private readonly mailModel: Model<EmailVerificationDocument>, // private readonly mailgunService: MailgunService,
  ) {
    super(mailModel);
  }

  async sendMail(sendMailOptions: MailgunMessageData): Promise<HttpStatus> {
    //   TODO: mail service integration
    try {
      //   const sentEmailResponse = await this.mailgunService.createEmail(
      //     config.domain,
      //     {
      //       ...sendMailOptions,
      //       from: `Flowell@${config.domain}`,
      //     },
      //   );
      //   return sentEmailResponse.status;
      return 200; // TODO: remove this linea
    } catch (error) {
      throwError(error?.message, error?.status);
    }
  }

  getVerificationCode(): number {
    return voucherCodeGenerator({
      charset: '0123456789',
      length: 5,
      prefix: '5',
    })[0] as any;
  }

  getExpiresAt(mins: number = 30): DateTime {
    return DateTime.now().set({ minute: mins });
  }

  isVerificationCodeExpired(expiresAt: string): boolean {
    return DateTime.fromISO(expiresAt).diffNow().isValid;
  }
}
