import { CacheModule, MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RoleEntity } from "./entities/role.entity";
import { RoleTranslationEntity } from "./entities/role-translation.entity";
import { CacheAvailableTaxesMiddleware } from "../libs/middlewares/cache-available-taxes";
import { RoleV1Controller } from "./controllers/role-v1.controller";
import { RoleService } from "./services/role.service";

@Module({
  imports:[ TypeOrmModule.forFeature([ RoleEntity, RoleTranslationEntity ]), CacheModule.register()],
  controllers: [RoleV1Controller],
  providers: [RoleService],
  exports: [RoleService],
})

export class RoleModule implements NestModule {

  configure(consumer: MiddlewareConsumer): any {

    consumer.apply(CacheAvailableTaxesMiddleware).forRoutes(RoleV1Controller)

  }
}
