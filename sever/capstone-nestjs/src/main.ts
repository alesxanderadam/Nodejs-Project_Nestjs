import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express'
import { DocumentBuilder } from '@nestjs/swagger';
import { SwaggerModule } from '@nestjs/swagger/dist';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(express.static("."))
  app.use(express.json());
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe())
  const config = new DocumentBuilder().setTitle("Swagger Test").addBearerAuth().build();
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup("/swagger", app, document)
  await app.listen(3001);
}
bootstrap();
