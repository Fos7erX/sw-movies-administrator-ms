import { createParamDecorator, ExecutionContext } from '@nestjs/common';


//Nota de documentación: Este es un decorador custom para poder enviar el auth token via header sin necesidad de enviarlo por parámetro
export const AuthToken = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.headers.authorization; 
  },
);   