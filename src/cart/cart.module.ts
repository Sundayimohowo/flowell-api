import { Module, Global } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { ProductService } from 'src/products/products.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CartSchema } from 'src/entity/carts';
import { Collections } from 'src/utils/enums/collections.enum';
import { ProductSchema } from 'src/entity/products';
import { UploadService } from 'src/services/upload/upload.service';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Collections.products, schema: ProductSchema },
    ]),
    MongooseModule.forFeature([
      { name: Collections.carts, schema: CartSchema },
    ]),
  ],
  controllers: [CartController],
  providers: [CartService, ProductService, UploadService],
})
export class CartModule {}
