import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model, Types } from 'mongoose';
import { CartDocument } from 'src/entity/carts';
import { ProductDocument } from 'src/entity/products';
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
    const $in = items.map((item) => new Types.ObjectId(item));

    const fullCart: any = await this.getCartItems(
      user as unknown as string,
      $in,
    );

    await this.updateById(cart?.id, { items }, { new: true });

    return {
      user: fullCart.user,
      items,
      _id: fullCart._id,
      createdAt: fullCart.createdAt,
      updatedAt: fullCart.updatedAt,
      total: fullCart.total,
    } as any;
  }

  async removeFromCart(id: string, productId: string): Promise<CartDocument> {
    const user = new Types.ObjectId(id);

    const cart = await this.findOne({ user });
    const items = cart.items.filter((item: any) => item !== productId);

    if (!items.includes(productId as any)) {
      throwError('Product not be found', HttpStatus.NOT_FOUND);
    }

    const $in = items.map((item) => new Types.ObjectId(item));
    const fullCart: any = await this.getCartItems(
      user as unknown as string,
      $in,
    );

    await this.updateById(cart?.id, { items }, { new: true });

    return {
      user: fullCart.user,
      items,
      _id: fullCart._id,
      createdAt: fullCart.createdAt,
      updatedAt: fullCart.updatedAt,
      total: fullCart.total,
    } as any;
  }

  async getCartItems(
    userId: string,
    $in = [],
  ): Promise<CartDocument & { items: ProductDocument[] }> {
    const user = new Types.ObjectId(userId);

    const cart: any = await this.findOne({ user });
    if (!cart) {
      throwError('Cart can not be found for this user', HttpStatus.NOT_FOUND);
    }

    let total = 0;
    let items = [];

    if ($in.length) {
      const products = await this.productService.find({ _id: { $in } });
      products?.forEach((product) => (total += product.price));
      items = products;
    }

    return {
      user: cart.user,
      items,
      _id: cart._id,
      createdAt: cart.createdAt,
      updatedAt: cart.updatedAt,
      total,
    } as any;
  }
}
