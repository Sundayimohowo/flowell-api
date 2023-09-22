import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
//
import { NewProductGuard } from 'src/gaurds/new-product.gaurd';
import { ProductDocument } from 'src/entity/products';
import { createDataResponse } from 'src/utils/response.util';
import { IPaginateResult } from 'src/utils/page-options';
import { ProductService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private productService: ProductService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(NewProductGuard)
  async createProduct(
    @Body() body: ProductDocument,
  ): Promise<{ data: ProductDocument }> {
    return createDataResponse(this.productService.create(body));
  }

  @Get()
  async getProducts(
    @Query() query: any,
  ): Promise<IPaginateResult<ProductDocument>> {
    return await this.productService.findPaginated(query);
  }

  @Get('/:id')
  async getProduct(
    @Param('id') id: string,
  ): Promise<{ data: ProductDocument }> {
    return createDataResponse(this.productService.findById(id));
  }

  @Put('/:id')
  async updateProduct(
    @Param('id') id: string,
    @Body() body: ProductDocument,
  ): Promise<{ data: ProductDocument }> {
    return createDataResponse(
      this.productService.updateById(id, body, { new: true }),
    );
  }

  @Put('/:id/images')
  @UseInterceptors(
    FilesInterceptor('files', 1, {
      // storage: diskStorage({
      //   destination: './temp',
      //   filename: generateRandomFileName,
      // }),
    }),
  )
  async uploadProductImages(
    @Param('id') id: string,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ): Promise<{ data: ProductDocument }> {
    return createDataResponse(
      this.productService.uploadProductImages(id, files),
    );
  }
}
