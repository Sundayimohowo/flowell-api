import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { MongooseGenericRepository } from 'src/utils/repository/generic.repository';
import { PasswordDocument } from 'src/entity/password';
import { Collections } from 'src/utils/enums/collections.enum';

@Injectable()
export class PasswordService extends MongooseGenericRepository<PasswordDocument> {
  private SALT = 10;
  constructor(
    @InjectModel(Collections.passwords)
    private passwordModel: Model<PasswordDocument>,
  ) {
    super(passwordModel);
  }

  async hashPassword(password: string): Promise<string> {
    const hash = await bcrypt.hash(password, this.SALT);
    return hash;
  }

  async isMatch(password: string, hashedPassword: string) {
    const hash = await bcrypt.compare(password, hashedPassword);
    return hash;
  }
}
