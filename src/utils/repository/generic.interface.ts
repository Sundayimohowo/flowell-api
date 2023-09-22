import { FilterQuery, QueryOptions, UpdateQuery } from 'mongoose';
import { IPaginateOptions, IPaginateResult } from '../page-options';

export abstract class IGenericRepository<T> {
  abstract create(item: T): Promise<T>;

  abstract updateById(
    id: string,
    item: UpdateQuery<T>,
    options: QueryOptions<T>,
  );

  abstract find(filter: FilterQuery<T>): Promise<T[]>;

  abstract findPaginated(
    paginateOptions: IPaginateOptions<T>,
  ): Promise<IPaginateResult<T>>;

  abstract findOne(filter: FilterQuery<T>): Promise<T>;

  abstract findById(id: string): Promise<T>;

  abstract delete(id: string): Promise<T>;

  abstract count(filterQuery: FilterQuery<T>): Promise<number>;
}
