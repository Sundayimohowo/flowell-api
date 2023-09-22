import { Module, Global } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsController } from './products.controller';
import { ProductService } from './products.service';
import { UploadService } from 'src/services/upload/upload.service';
import { ProductSchema } from 'src/entity/products';
import { Collections } from 'src/utils/enums/collections.enum';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Collections.products, schema: ProductSchema },
    ]),
  ],
  controllers: [ProductsController],
  providers: [ProductService, UploadService],
})
export class ProductsModule {}
