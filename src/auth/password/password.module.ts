import { Module } from '@nestjs/common';
import { PasswordService } from './password.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PasswordModel, PasswordSchema } from 'src/entity/password';
import { Collections } from 'src/utils/enums/collections.enum';

@Module({
  controllers: [],
  imports: [
    MongooseModule.forFeature([
      { name: Collections.passwords, schema: PasswordSchema },
    ]),
  ],
  providers: [PasswordService],
  exports: [PasswordService],
})
export class PasswordModule {}
