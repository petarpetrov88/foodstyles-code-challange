import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './modules/app/app.module';
import { NestJSLoggerService } from './modules/logger/services/nestjs-logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const options = new DocumentBuilder()
    .setTitle('Foodstyles technical challenge')
    .setDescription(
      `Petar Petrov's implementation of Search API for Foodstyles.`,
    )
    .setVersion('1.0')
    .addServer('http://localhost:3000/', 'Local environment')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/docs', app, document);
  app.useLogger(app.get(NestJSLoggerService));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidUnknownValues: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen(3000);
}
bootstrap();
