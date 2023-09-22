import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { productValidatorSchema } from 'src/validators/products';

@Injectable()
export class NewProductGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    productValidatorSchema.parse(request.body);
    return true;
  }
}
