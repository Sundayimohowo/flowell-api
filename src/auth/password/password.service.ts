import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { MongooseGenericRepository } from 'src/utils/repository/generic.repository';
import { PasswordDocument, PasswordModel } from 'src/entity/password';

@Injectable()
export class PasswordService extends MongooseGenericRepository<PasswordDocument> {
  private SALT = 10;
  constructor(
    @InjectModel(PasswordModel.name)
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