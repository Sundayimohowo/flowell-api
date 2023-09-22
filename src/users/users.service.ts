import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
//
import { UserDocument } from 'src/entity/users';
import { Collections } from 'src/utils/enums/collections.enum';
import { MongooseGenericRepository } from 'src/utils/repository/generic.repository';

@Injectable()
export class UsersService extends MongooseGenericRepository<UserDocument> {
  constructor(
    @InjectModel(Collections.users) private userModel: Model<UserDocument>,
  ) {
    super(userModel);
  }
}
