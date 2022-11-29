import { NestFactory } from '@nestjs/core';
import source from './ormconfig';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { HttpExceptionFilter } from '@lib/errors/http-exception.filter';
import { TypeormErrorFilter } from '@lib/errors/typeorm.error.filter';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import config from '@common/config';
import { AppModule } from '@app/app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { join } from 'path';
import { AllExceptionsFilter } from '@common/filters/all-exceptions.filter';
import * as express from 'express';


async function bootstrap() {
  await source.initialize();

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalPipes(new TypeormErrorFilter());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  app.enableCors();

  app.enableVersioning({
    type: VersioningType.URI,
  });

  if (!!config('app.enable_swagger')) {
    // todo : if condition always true
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Nest.js StarterKit')
      .setDescription('API Documentation')
      .setVersion('0.0.1')
      .addBearerAuth()
      // .addTag('Starter kit')
      .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('docs', app, document);
  }

  app.use('/public', express.static(join(__dirname, '../../public')));
  const bodyParser = require('body-parser');
  app.use(bodyParser.json({ limit: '5mb' }));
  app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }));
  app.useGlobalFilters(new AllExceptionsFilter());

  /* SECURITY */
  app.enable('trust proxy');
  app.use(helmet());

  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
      message: 'Too many requests from this IP, please try again later',
    }),
  );
  const createAccountLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1-hour window
    max: 3, // start blocking after 3 requests
    message:
      'Too many accounts created from this IP, please try again after an hour',
  });
  app.use('/auth/email/register', createAccountLimiter);
  /******/

  await app.listen(config('app.port'));
}
bootstrap();
