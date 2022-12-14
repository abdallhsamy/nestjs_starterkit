import {
  CacheModule,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleEntity } from './entities/role.entity';
import { RoleTranslationEntity } from './entities/role-translation.entity';
import { CacheAvailableTaxesMiddleware } from '@lib/middlewares/cache-available-taxes';
import { RoleV1Controller } from './controllers/role-v1.controller';
import { RoleV1Service } from './services/role-v1.service';
import { RolePermissionV1Service } from '../permission/services/role-permission-v1.service';
import { PermissionModule } from '../permission/permission.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RoleEntity, RoleTranslationEntity]),
    CacheModule.register(),
    PermissionModule,
  ],
  controllers: [RoleV1Controller],
  providers: [RoleV1Service, RolePermissionV1Service],
  exports: [RoleV1Service],
})
export class RoleModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(CacheAvailableTaxesMiddleware).forRoutes(RoleV1Controller);
  }
}
