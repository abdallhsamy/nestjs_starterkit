import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import source from './ormconfig';
import { HttpExceptionFilter } from './libs/errors/http-exception.filter';
import { TypeormErrorFilter } from './libs/errors/typeorm.error.filter';
import { ValidationPipe, VersioningType } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
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
  await app.listen(configService.get('APP_PORT',3000));
}
bootstrap();
