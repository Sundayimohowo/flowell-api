import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model, Types } from 'mongoose';
import { CartDocument } from 'src/entity/carts';
import { ProductService } from 'src/products/products.service';
import { Collections } from 'src/utils/enums/collections.enum';
import { MongooseGenericRepository } from 'src/utils/repository/generic.repository';
import { throwError } from 'src/utils/response.util';

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
    console.log(
      '🚀 ~ file: cart.service.ts:23 ~ CartService ~ getCartByUserId ~ cart:',
      cart,
    );

    if (!!cart) {
      const products = await this.productService.find(cart?.items);

      if (products?.length) Object.assign(cart, { items: products });
    } else {
      // create cart if i has not been created
      return this.create({ user, total: 0, items: [] } as CartDocument);
    }

    return cart;
  }

  async clearCart(id: string): Promise<CartDocument> {
    return this.updateById(id, { items: { $set: [] } });
  }

  async updateCart(id: string, items: string[]): Promise<CartDocument> {
    const cart = await this.findById(id);

    if (cart.items.includes(id as any)) {
      throwError('Product already added to cart', HttpStatus.BAD_REQUEST);
    }
    return this.updateById(id, { items: { $set: [] } });
  }

  async addProductToCart(id: string, productId: string): Promise<CartDocument> {
    const user = new Types.ObjectId(id);

    const cart = await this.findOne({ user });
    const items = Array.from(new Set([...cart.items, productId]));

    return this.updateById(cart?.id, { items }, { new: true });
  }
  async removeFromCart(id: string, productId: string): Promise<CartDocument> {
    const user = new Types.ObjectId(id);

    const cart = await this.findOne({ user });
    const items = cart.items.filter((item: any) => item !== productId);

    if (!cart) {
      throwError('Cart can not be found for this user', HttpStatus.NOT_FOUND);
    }
    return this.updateById(cart?.id, { items }, { new: true });
  }
}
