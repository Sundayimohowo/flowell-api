import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
//
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserModel, UserSchema } from 'src/entity/users';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: UserModel.name, schema: UserSchema }]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
