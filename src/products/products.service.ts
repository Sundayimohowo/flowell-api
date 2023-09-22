import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
//
import { UploadService } from '../services/upload/upload.service';
import { MongooseGenericRepository } from 'src/utils/repository/generic.repository';
import { ProductDocument } from 'src/entity/products';
import { IPaginateResult } from 'src/utils/page-options';
import { IAttachment } from 'src/utils/interface/attachment.interface';
import { logger } from 'src/utils/logger.util';
import { Collections } from 'src/utils/enums/collections.enum';

@Injectable()
export class ProductService extends MongooseGenericRepository<ProductDocument> {
  constructor(
    @InjectModel(Collections.products)
    private productModel: Model<ProductDocument>,
    private uploadService: UploadService,
  ) {
    super(productModel);
  }

  async findPaginated(query: any): Promise<IPaginateResult<ProductDocument>> {
    return super.findPaginated({});
  }

  async uploadProductImages(
    id: string,
    files: Express.Multer.File[],
  ): Promise<ProductDocument> {
    const product: ProductDocument = await this.findById(id);
    const attachments: IAttachment[] = product.attachments || [];
    const file = files[0];

    if (!!file) {
      this.uploadService
        .uploadFile(file.buffer.toString('base64'), file.originalname)
        .then((res) => {})
        .catch((err) => {});

      // attachments.push({ url });
    }

    logger.info('Files uploaded');

    await this.updateById(id, { $set: { attachments } });
    return await this.findById(id);
  }
}
