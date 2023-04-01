import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(express.static("./public/images"))
  app.use(express.json());
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe())
  const config = new DocumentBuilder()
    .setTitle("Movie")
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
    }, 'bearer') // sử dụng bearer thay vì jwt
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("/swagger", app, document, {
    swaggerOptions: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'Token',
        },
      },
      security: [{ bearerAuth: [] }],
    },
  });
  await app.listen(3001);
}
bootstrap();
