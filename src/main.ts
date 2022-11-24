import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import source from './ormconfig';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { HttpExceptionFilter } from './libs/errors/http-exception.filter';
import { TypeormErrorFilter } from './libs/errors/typeorm.error.filter';
import { ValidationPipe, VersioningType } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import config from "@src/config";
// import { MicroserviceOptions, Transport } from '@nestjs/microservices';
// import serverConfig from './libs/serverConfig/serverConfig';
// const port = serverConfig.port;
// const MQ_USER = serverConfig.MQ_USER;
// const MQ_PASS = serverConfig.MQ_PASS;
// const MQ_URL = serverConfig.MQ_URL;
const configService = new ConfigService();

async function bootstrap() {
  await source.initialize();

  // const microservice = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
  //   transport: Transport.RMQ,
  //   options: {
  //     urls: [`amqp://${MQ_USER}:${MQ_PASS}@${MQ_URL}`],
  //     queue: 'main_queue',
  //     queueOptions: {
  //       durable: false
  //     },
  //   },
  // });

  const app = await NestFactory.create(AppModule);

  // app.setGlobalPrefix('api');

  app.useGlobalPipes(new TypeormErrorFilter());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  app.enableCors();

  app.enableVersioning({
    type: VersioningType.URI,
  });

  if (!!config('app.enable_swagger')) { // todo : if condition always true
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


  await app.listen(config('app.port'));
}
bootstrap();
