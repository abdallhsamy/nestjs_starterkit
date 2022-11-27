import {
  CacheModule,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionEntity } from './entities/permission.entity';
import { PermissionV1Controller } from './controllers/permission-v1.controller';
import { PermissionV1Service } from './services/permission-v1.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([PermissionEntity]),
    CacheModule.register(),
  ],
  controllers: [PermissionV1Controller],
  providers: [PermissionV1Service],
  exports: [PermissionV1Service],
})
export class PermissionModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    // consumer.apply(CacheAvailableTaxesMiddleware).forRoutes(PermissionV1Controller)
  }
}
