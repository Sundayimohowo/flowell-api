import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
//
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserSchema } from 'src/entity/users';
import { Collections } from 'src/utils/enums/collections.enum';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Collections.users, schema: UserSchema },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
