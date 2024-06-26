import { CallHandler, ExecutionContext, HttpException, HttpStatus, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Observable, catchError, throwError } from 'rxjs';
import { DefaultResponse } from 'src/shared/models/default-response';
import { ErrorResponse } from 'src/shared/models/error-response.interface';

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  private readonly logger = new Logger(ErrorInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((err) => {
        console.log(err);
        this.logger.error(err.name, err.stack);
        return throwError(() => {
          const response = new DefaultResponse<ErrorResponse>(null, [
            { code: 'IS0001500', message: 'Se ha producido un error inesperado:' }
          ]);
          return new HttpException(response, HttpStatus.BAD_GATEWAY);
        });
      })
    );
  }
}
