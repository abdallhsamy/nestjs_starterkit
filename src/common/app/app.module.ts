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
import { MailerModule } from "@nestjs-modules/mailer";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { join } from "path";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import config from '@common/config';

@Module({
  imports: [
    TypeOrmModule.forRoot(ormOptions),
    AuthModule,
    PermissionModule,
    RoleModule,
    UserModule,
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async () => ({
        transport: {
          host: config('mail.host'),
          secure: false,
          ignoreTLS: true,
          port: config('mail.port'),
          auth: {
            user: config('mail.user'),
            pass: config('mail.password'),
          },
        },
        defaults: {
          from: config('mail.mail_from')
        },
        template: {
          dir: join(__dirname, './email_templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true
          }
        }
      }),
      inject: [ConfigService]
    }), ConfigModule.forRoot(),
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
