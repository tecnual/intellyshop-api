import { CallHandler, ExecutionContext, HttpException, HttpStatus, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Observable, catchError, throwError } from 'rxjs';
import { DefaultResponse } from 'src/shared/models/default-response.dto';
import { ErrorResponse } from 'src/shared/models/error-response.dto';

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const logger = new Logger(context.getClass().name);
    const req = context.switchToHttp().getRequest();
    const method = req.method;
    const url = req.url;
    const now = Date.now();

    return next.handle().pipe(
      catchError((err) => {
        const status = err.response.statusCode || 500;
        logger.error(`${method} ${url} ${status} +${Date.now() - now}ms`);
        logger.verbose(JSON.stringify(err));
        return throwError(() => this.setResponse(err));
      })
    );
  }

  setResponse(err) {
    const status = err.response.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
    const code = 'IS000' + status;

    const errors = err.response.message.map((e) => ({ code, message: e }));

    const response = new DefaultResponse<ErrorResponse>(null, errors);
    return new HttpException(response, status);
  }
}
