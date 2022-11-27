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

@Module({
  imports: [TypeOrmModule.forRoot(ormOptions), PermissionModule, RoleModule, UserModule],
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
