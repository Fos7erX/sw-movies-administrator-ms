//Nota de documentación: ¿Qué es esto?
//Este interceptor es una clase que va a estandarizar los responses del microservicio, para tener una estructura en las respuestas unificadas, y no tener que cambiar 1 por 1 los controllers individuales

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { format } from 'date-fns';
import { STATUS_CODES } from 'http';

//Seteo los types para los objetos meta, data y errors que conformarán el response.
export type MetaResponse = {
  status: string;
  statusCode: number;
  path: string;
  timestamp: string;
};

export type ErrorPayload = {
  code?: number | string;
  message?: string;
};

export type ResponseWrapper<T> = {
  meta: MetaResponse;
  data: T | null;
  errors: ErrorPayload | null;
};

@Injectable()
export class GlobalResponseInterceptor<T> implements NestInterceptor<
  T,
  ResponseWrapper<T>
> {
  //Implemento custom interceptor para response global
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ResponseWrapper<T>> {
    return next.handle().pipe(
      map((res: unknown) => this.responseHandler(res, context)),
      catchError((err: any) =>
        throwError(() => this.errorHandler(err, context)),
      ),
    );
  }

  //Seteo estructura del error response con error handler
  errorHandler(exception: any, context: ExecutionContext) {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    //Declaro propiedades del response con sus respectivos tipos de datos.
    const statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const statusText = STATUS_CODES[statusCode] ?? String(statusCode);

    const meta: MetaResponse = {
      status: statusText,
      statusCode: statusCode,
      path: request.url,
      timestamp: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
    };

    const errors = {
      code: statusCode,
      message: exception?.message ?? 'Internal server error',
    };

    const payload: ResponseWrapper<null> = {
      meta,
      data: null,
      errors,
    };

    //Retorno exception
    return new HttpException(payload, statusCode);
  }

  //Seteo response handler con las propiedades previamente declaradas
  responseHandler(res: any, context: ExecutionContext): ResponseWrapper<T> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const statusCode = response.statusCode;

    //Retorno response con el formato meta, data, errors. Lo cual lo vuelve más prolijo y legible para frontend (La verdad les facilita el desarrollo).
    return { 
      meta: {
        status: 'Ok',
        path: request.url,
        statusCode,
        timestamp: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
      },
      data: res,
      errors: null,
    };
  }
}
