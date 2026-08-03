import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
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
