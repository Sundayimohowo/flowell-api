import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';

export type PasswordDocument = PasswordModel & Document;

@Schema({ timestamps: true })
export class PasswordModel {
  @Prop({ ref: 'user', required: true })
  user: Types.ObjectId;
  @Prop({ required: true })
  password: string;
}

export const PasswordSchema = SchemaFactory.createForClass(PasswordModel);
