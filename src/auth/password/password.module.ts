import { Module } from '@nestjs/common';
import { PasswordService } from './password.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PasswordModel, PasswordSchema } from 'src/entity/password';

@Module({
  controllers: [],
  imports: [
    MongooseModule.forFeature([
      { name: PasswordModel.name, schema: PasswordSchema },
    ]),
  ],
  providers: [PasswordService],
  exports: [PasswordService],
})
export class PasswordModule {}
