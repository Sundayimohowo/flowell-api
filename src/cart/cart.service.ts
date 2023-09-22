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
    const user = new Types.ObjectId(id);
    let cart = await this.findOne({ user });

    if (!!cart?.items.length) {
      const products = await this.productService.find(cart?.items);

      if (products?.length) Object.assign(cart, { items: products });
    } else return { user, items: [], total: 0 } as CartDocument;
    return cart;
  }

  async clearCart(id: string): Promise<CartDocument> {
    return this.updateById(id, { items: { $set: [] } });
  }

  async updateCart(id: string, items: string[]): Promise<CartDocument> {
    return this.updateById(id, { items: { $set: [] } });
  }
}
