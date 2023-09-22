import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IAttachment } from 'src/utils/interface/attachment.interface';

// @ts-ignore
const MongoPaging = require('mongo-cursor-pagination');

export type ProductDocument = ProductModel & Document;

@Schema({ timestamps: true })
export class ProductModel {
  @Prop({ required: true })
  name: string;
  @Prop({ required: true })
  description: string;
  @Prop({ required: true })
  price: number;
  @Prop({ required: true })
  sellingPrice: number;
  @Prop({ default: [] })
  attachments: IAttachment[];
}

export const ProductSchema = SchemaFactory.createForClass(ProductModel);

ProductSchema.plugin(MongoPaging.mongoosePlugin);
