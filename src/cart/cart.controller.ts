import {
  Controller,
  HttpCode,
  UseGuards,
  Body,
  Get,
  Query,
  Param,
  Put,
  Post,
  HttpStatus,
} from '@nestjs/common';
import { createDataResponse } from 'src/utils/response.util';
import { CartService } from './cart.service';
import { CartDocument } from 'src/entity/carts';

@Controller('cart')
export class CartController {
  constructor(private cartService: CartService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  //   @UseGuards(NewProductGuard)
  async createProduct(
    @Body() body: CartDocument,
  ): Promise<{ data: CartDocument }> {
    return createDataResponse(this.cartService.create(body));
  }

  @Get('/:id')
  async getCart(@Param('id') id: string): Promise<{ data: CartDocument }> {
    return createDataResponse(this.cartService.findById(id));
  }

  @Get('/users/:id')
  async getCartByUserId(
    @Param('id') id: string,
  ): Promise<{ data: CartDocument }> {
    return createDataResponse(this.cartService.getCartByUserId(id));
  }

  @Put('/:id')
  async updateProduct(
    @Param('id') id: string,
    @Body() body: CartDocument,
  ): Promise<{ data: CartDocument }> {
    return createDataResponse(
      this.cartService.updateById(id, body, { new: true }),
    );
  }
  @Get('/:user/add/:productId')
  async addProductToCart(
    @Param('user') user: string,
    @Param('productId') productId: string,
  ): Promise<{ data: CartDocument }> {
    return createDataResponse(
      this.cartService.addProductToCart(user, productId),
    );
  }

  @Get('/:user/remove/:productId')
  async removeProduct(
    @Param('user') user: string,
    @Param('productId') productId: string,
  ): Promise<{ data: CartDocument }> {
    return createDataResponse(this.cartService.removeFromCart(user, productId));
  }
}
