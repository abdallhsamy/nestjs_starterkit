import { CacheModule, MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { RoleService } from './role.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { RoleEntity } from "./entities/role.entity";
import { RoleTrEntity } from "./entities/role-tr.entity";
import { RoleController } from "./role.controller";
import { CacheAvailableTaxesMiddleware } from "../libs/middlewares/cache-available-taxes";

@Module({
  imports:[ TypeOrmModule.forFeature([ RoleEntity, RoleTrEntity ]), CacheModule.register()],
  controllers: [RoleController],
  providers: [RoleService],
  exports: [RoleService],
})

export class RoleModule implements NestModule {

  configure(consumer: MiddlewareConsumer): any {

    consumer.apply(CacheAvailableTaxesMiddleware).forRoutes(RoleController)

  }
}
