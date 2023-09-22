import { HttpException, HttpStatus } from '@nestjs/common';

export const throwClientError = (message: string) => {
  throwError(message, HttpStatus.BAD_REQUEST);
};

export const throwError = (message: string, statusCode: number) => {
  throw new HttpException(message, statusCode);
};

export const createDataResponse = async (
  response: Promise<any>,
): Promise<{ data: any }> => {
  const data = await response;
  return { data };
};
