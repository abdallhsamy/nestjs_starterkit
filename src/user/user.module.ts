import {
  CacheModule,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { CacheAvailableTaxesMiddleware } from '@lib/middlewares/cache-available-taxes';
import { UserV1Controller } from './controllers/user-v1.controller';
import { UserV1Service } from './services/user-v1.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), CacheModule.register()],
  controllers: [UserV1Controller],
  providers: [UserV1Service],
  exports: [UserV1Service],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(CacheAvailableTaxesMiddleware).forRoutes(UserV1Controller);
  }
}
