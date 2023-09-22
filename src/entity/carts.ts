import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';

export type CartDocument = CartModel & Document;

@Schema({ timestamps: true })
export class CartModel {
  @Prop({ required: true, ref: 'users' })
  user: Types.ObjectId;
  @Prop({ default: [] })
  items: Types.ObjectId[];
  @Prop({ default: 0 })
  total: number;
}

export const CartSchema = SchemaFactory.createForClass(CartModel);
