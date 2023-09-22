import { FilterQuery } from 'mongoose';

export interface SingleResponse<T> {
  data?: T;
}

export interface ArrayResponse<T> {
  data?: T[];
}

export interface IPaginateOptions<T> {
  filterQuery?: FilterQuery<T>;
  paginatedField?: string;
  sortAscending?: boolean;
  limit?: number;
  nextPage?: string;
  previousPage?: string;
}

export interface IPaginatePageInfo {
  previous: string;
  next: string;
  hasPrevious: boolean;
  hasNext: boolean;
}

export interface IPaginateResult<T> {
  data: T[];
  pageInfo: IPaginatePageInfo;
}
