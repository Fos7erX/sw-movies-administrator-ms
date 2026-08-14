import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //Corrección #1: Validation pipes globales:
  //Nota de documentación: ¿Para qué utilizar validationPipe global?
  // Los validationPipes se utilizan para verificar los datos proporcionados a los DTO por medio de los decoradores, para que lleguen de forma correcta al controler, y transformar los tipos de datos de ser necesario. Esto tiene beneficios en cuanto a la seguridad, la validación automática de datos y la transformación de tipos (Ya que convierte automáticamente los valores de entrada a los tipos definidos en los DTO).
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist:true,
      forbidNonWhitelisted:true,
      transform:true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    })
  )
  
//>
  //Swagger UI installation --> Utilizo Swagger UI en este caso, tanto para la documentación y para facilitar el testeo
  //  de los endpoints en el microservicio

  const config = new DocumentBuilder()
  .setTitle('sw-movies-administrator-ms')
  .setDescription('Microservice for Star Wars movies administration, both for regular users and administrators.')
  .setVersion('0.0.1')
  .addBearerAuth()
  .build()

  
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);

}
bootstrap();
