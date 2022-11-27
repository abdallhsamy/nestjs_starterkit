import {
  Controller,
  Get,
  UseInterceptors,
  ClassSerializerInterceptor,
  Param,
  Query,
  ParseIntPipe,
  Post,
  Body,
  Res,
  UsePipes,
  ValidationPipe,
  Patch,
  Delete,
} from '@nestjs/common';
import { ValidateNested } from 'class-validator';
import { UpdateProfileV1Dto } from '../dto/update-profile-v1.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import * as swagger from '../swagger/profile-v1.swagger';
import { ProfileV1Service } from "@src/user/services/profile-v1.service";

@ApiBearerAuth()
@ApiTags('users')
@Controller({ path: 'profile', version: '1' })
export class ProfileV1Controller {
  constructor(private readonly service: ProfileV1Service) {}

  @Get('/')
  // @ApiQuery(swagger.findAll.req.query.name)
  @ApiOkResponse(swagger.get.res.ok)
  @ApiUnauthorizedResponse(swagger.get.res.unauthorized)
  @UseInterceptors(ClassSerializerInterceptor)
  getProfile() {
    return this.service.get();
  }

  @Post('/')
  @ApiBody(swagger.update.req.body)
  @ApiCreatedResponse(swagger.update.res.ok)
  @ApiUnauthorizedResponse(swagger.update.res.unauthorized)
  @ApiConflictResponse(swagger.update.res.unprocessable)
  @ApiBadRequestResponse(swagger.update.res.bad_request_email)
  @UsePipes(ValidationPipe)
  @UseInterceptors(ClassSerializerInterceptor)
  async updateProfile(@Body() dto: UpdateProfileV1Dto): Promise<any> {
    return await this.service.update(dto);
  }
}
