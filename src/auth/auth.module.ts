import { Module } from '@nestjs/common';
import { AuthV1Controller } from "@src/auth/controllers/auth.controller";
import { AuthV1Service } from "@src/auth/services/auth-v1.service";

@Module({
  controllers: [AuthV1Controller],
  providers: [AuthV1Service]
})
export class AuthModule {}
