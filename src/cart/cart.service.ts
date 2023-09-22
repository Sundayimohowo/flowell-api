import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model, Types } from 'mongoose';
import { CartDocument } from 'src/entity/carts';
import { ProductService } from 'src/products/products.service';
import { Collections } from 'src/utils/enums/collections.enum';
import { MongooseGenericRepository } from 'src/utils/repository/generic.repository';

@Injectable()
export class CartService extends MongooseGenericRepository<CartDocument> {
  constructor(
    @InjectModel(Collections.carts) private cartModel: Model<CartDocument>,
    private productService: ProductService,
  ) {
    super(cartModel);
  }

  async getCartByUserId(id: string): Promise<CartDocument> {
    const cart = await this.findOne({ user: new Types.ObjectId(id) });
    const products = await this.productService.find(cart.items);

    if (products?.length) Object.assign(cart, { items: products });
    return cart;
  }

  async clearCart(id: string): Promise<CartDocument> {
    return this.updateById(id, { items: { $set: [] } });
  }
    
  async updateCart(id: string, items: string[]): Promise<CartDocument> {
    return this.updateById(id, { items: { $set: [] } });
  }
}
