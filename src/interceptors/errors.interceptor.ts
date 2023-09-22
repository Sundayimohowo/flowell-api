import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  HttpStatus,
  BadRequestException,
  BadGatewayException,
} from '@nestjs/common';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { Observable, catchError, throwError } from 'rxjs';
import { ZodError } from 'zod';

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((err) => {
        // validation errors handler (generic error handler)
        if (err instanceof ZodError) {
          const errors = err.issues.map((issue) => ({
            message: issue.message,
          }));
          return throwError(
            () =>
              new BadRequestException({
                errors,
                statusCode: HttpStatus.BAD_REQUEST,
              }),
          );
        }

        // http error handler
        if (err instanceof HttpException) {
          return throwError(
            () =>
              new HttpException(
                err.message,
                err.getStatus() || HttpStatus.BAD_REQUEST,
              ),
          );
        }

        return throwError(() => new BadGatewayException());
      }),
    );
  }
}
