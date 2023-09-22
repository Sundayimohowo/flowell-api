import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
//
import { UserDocument, UserModel } from 'src/entity/users';
import { MongooseGenericRepository } from 'src/utils/repository/generic.repository';

@Injectable()
export class UsersService extends MongooseGenericRepository<UserDocument> {
  constructor(
    @InjectModel(UserModel.name) private userModel: Model<UserDocument>,
  ) {
    super(userModel);
  }
}
