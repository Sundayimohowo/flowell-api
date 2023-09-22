import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';
import { UserRole } from 'src/utils/enums/user-role.enum';

// @ts-ignore
const MongoPaging = require('mongo-cursor-pagination');

export type UserDocument = UserModel & Document;

@Schema({ timestamps: true })
export class UserModel {
  @Prop({ required: true })
  firstName: Types.ObjectId;
  @Prop({ required: true })
  lastName: string;
  @Prop({ required: true })
  email: string;
  @Prop({ required: true, default: [UserRole.USER] })
  roles: string[];
}

export const UserSchema = SchemaFactory.createForClass(UserModel);

UserSchema.plugin(MongoPaging.mongoosePlugin);
