import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Date } from 'mongoose';

// @ts-ignore
const MongoPaging = require('mongo-cursor-pagination');

export type EmailVerificationDocument = EmailVerificationModel & Document;

@Schema({ timestamps: true })
export class EmailVerificationModel {
  @Prop({ required: true })
  email: string;
  @Prop({ required: true })
  verificationCode: number;
  @Prop({ required: true, type: Date })
  expiresAt: Date;
  @Prop({ default: false })
  used: boolean;
}

export const EmailVerificationSchema = SchemaFactory.createForClass(
  EmailVerificationModel,
);

EmailVerificationSchema.plugin(MongoPaging.mongoosePlugin);
