import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { RoleModule } from './role/role.module';
import { ormOptions } from './ormconfig';
import { SetGlobalVarsMiddleware } from './libs/middlewares/set-global-vars';
import { TypeOrmModule } from '@nestjs/typeorm';

import serverConfig from './libs/serverConfig/serverConfig';
const MQ_USER = serverConfig.MQ_USER;
const MQ_PASS = serverConfig.MQ_PASS;
const MQ_URL = serverConfig.MQ_URL;

@Module({
  imports: [
    TypeOrmModule.forRoot(ormOptions),
    RoleModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(SetGlobalVarsMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
