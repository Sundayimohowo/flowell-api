import { FilterQuery, Model, QueryOptions, UpdateQuery } from 'mongoose';
import { HttpStatus } from '@nestjs/common';
import { IGenericRepository } from './generic.interface';
import { IPaginateOptions, IPaginateResult } from '../page-options';
import { throwError } from '../response.util';

export abstract class MongooseGenericRepository<T>
  implements IGenericRepository<T>
{
  private _model: Model<T>;

  protected constructor(model: Model<T>) {
    this._model = model;
  }

  create(item: T): Promise<T> {
    console.log('>>> Creating: ', item);
    return this._model.create(item);
  }

  delete(id: string): Promise<T> {
    return this._model.findByIdAndDelete(id).exec();
  }

  find(filter: FilterQuery<T> = {}): Promise<T[]> {
    console.log('>>> Finding query: ', filter);
    return this._model.find(filter).exec();
  }

  async findById(id: string): Promise<T> {
    const model = await this._model.findById(id).exec();
    if (!model) throwError('Item not found', HttpStatus.NOT_FOUND);
    return model;
  }

  findOne(filter: FilterQuery<T> = {}): Promise<T> {
    return this._model.findOne(filter).exec();
  }

  async findPaginated(
    paginateOptions: IPaginateOptions<T>,
  ): Promise<IPaginateResult<T>> {
    console.log('>>> Finding paginated: ', paginateOptions);
    (paginateOptions as any).filter =
      typeof paginateOptions.filterQuery === 'string'
        ? JSON.parse(paginateOptions.filterQuery as any)
        : paginateOptions.filterQuery;
    delete paginateOptions.filterQuery;
    console.log('>>> Finding paginated 2: ', paginateOptions);
    const result = await (this._model as any).paginate(paginateOptions);
    console.log('>>> Finding result: ', result);
    return {
      data: result.results,
      pageInfo: {
        previous: result.previous,
        next: result.next,
        hasPrevious: result.hasPrevious,
        hasNext: result.hasNext,
      },
    };
  }

  async updateById(
    id: string,
    update: UpdateQuery<T> = {},
    options: QueryOptions<T> = {},
  ): Promise<T> {
    delete update._id;
    const model = await this._model
      .findByIdAndUpdate(id, update, options)
      .exec();
    if (!model) throwError('Item not found', HttpStatus.NOT_FOUND);
    return this._model.findById(id);
  }

  count(filter: FilterQuery<T>): Promise<number> {
    return this._model.countDocuments(filter).exec();
  }
}
