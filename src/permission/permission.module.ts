import {
  CacheModule,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionEntity } from './entities/permission.entity';
import { PermissionV1Controller } from './controllers/permission-v1.controller';
import { PermissionService } from './services/permission.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([PermissionEntity]),
    CacheModule.register(),
  ],
  controllers: [PermissionV1Controller],
  providers: [PermissionService],
  exports: [PermissionService],
})
export class PermissionModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    // consumer.apply(CacheAvailableTaxesMiddleware).forRoutes(PermissionV1Controller)
  }
}
