import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { RoleModule } from '@src/role/role.module';
import { ormOptions } from '@src/ormconfig';
import { SetGlobalVarsMiddleware } from '@lib/middlewares/set-global-vars';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PermissionModule } from '@src/permission/permission.module';
import { UserModule } from '@src/user/user.module';
import { AuthModule } from '@src/auth/auth.module';
import { SentryModule } from '@ntegral/nestjs-sentry';
import config from '@config/index';

@Module({
  imports: [
    SentryModule.forRoot({
      dsn: config('sentry.dsn'),
      debug: true,
      environment: 'dev',
      // release: null, // must create a release in sentry.io dashboard
      logLevels: ['debug'], //based on sentry.io loglevel //
    }),
    TypeOrmModule.forRoot(ormOptions),
    AuthModule,
    PermissionModule,
    RoleModule,
    UserModule,
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
