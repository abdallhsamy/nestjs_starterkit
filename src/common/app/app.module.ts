import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { RoleModule } from '@src/modules/role/role.module';
import { ormOptions } from '@src/common/ormconfig';
import { SetGlobalVarsMiddleware } from '@lib/middlewares/set-global-vars';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SentryModule } from '@ntegral/nestjs-sentry';
import config from '@config/index';
import { UserModule } from '@src/modules/user/user.module';
import { AuthModule } from '@src/modules/auth/auth.module';
import { PermissionModule } from '@src/modules/permission/permission.module';

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
