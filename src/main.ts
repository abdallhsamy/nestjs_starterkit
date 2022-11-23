import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import source from './ormconfig';
import { HttpExceptionFilter } from './libs/errors/http-exception.filter';
import { TypeormErrorFilter } from './libs/errors/typeorm.error.filter';
import { ValidationPipe } from '@nestjs/common';
// import { MicroserviceOptions, Transport } from '@nestjs/microservices';
// import serverConfig from './libs/serverConfig/serverConfig';
// const port = serverConfig.port;
// const MQ_USER = serverConfig.MQ_USER;
// const MQ_PASS = serverConfig.MQ_PASS;
// const MQ_URL = serverConfig.MQ_URL;

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

  // app.connectMicroservice<MicroserviceOptions>(
  //   {
  //     transport: Transport.TCP,
  //     options: {
  //       host: serverConfig.ECOMMERCE_IP,
  //       port: serverConfig.ECOMMERCE_PORT,
  //     },
  //   },
  //   { inheritAppConfig: true },
  // );
  // app.startAllMicroservices();
  await app.listen(process.env.APP_PORT || 3000);
}
bootstrap();
