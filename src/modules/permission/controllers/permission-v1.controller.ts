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
  UsePipes,
  ValidationPipe,
  Patch,
  Delete,
} from '@nestjs/common';
import { PermissionV1Service } from '../services/permission-v1.service';
import { CreatePermissionV1Dto } from '../dto/create-permission-v1.dto';
import { ValidateNested } from 'class-validator';
import { UpdatePermissionV1Dto } from '../dto/update-permission-v1.dto';
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
import * as swagger from '../swagger/permission-v1.swagger';

@ApiBearerAuth()
@ApiTags('permissions')
@Controller({ path: 'permissions', version: '1' })
export class PermissionV1Controller {
  constructor(private readonly service: PermissionV1Service) {}

  @Get('search/:name')
  @UseInterceptors(ClassSerializerInterceptor)
  search(@Param('name') permissionName) {
    return this.service.search(permissionName);
  }

  @Get('/')
  @ApiQuery(swagger.findAll.req.query.limit)
  @ApiQuery(swagger.findAll.req.query.offset)
  // @ApiQuery(swagger.findAll.req.query.name)
  @ApiOkResponse(swagger.findAll.res.ok)
  @ApiUnauthorizedResponse(swagger.findAll.res.unauthorized)
  @UseInterceptors(ClassSerializerInterceptor)
  findAll(@Query() query) {
    return this.service.findAll(query);
  }

  @Post('/')
  @ApiBody(swagger.create.req.body)
  @ApiCreatedResponse(swagger.create.res.created)
  @ApiUnauthorizedResponse(swagger.create.res.unauthorized)
  @ApiConflictResponse(swagger.create.res.conflict)
  @ApiBadRequestResponse(swagger.create.res.bad_request)
  @ValidateNested()
  @UsePipes(ValidationPipe)
  @UseInterceptors(ClassSerializerInterceptor)
  async create(@Body() dto: CreatePermissionV1Dto): Promise<any> {
    return await this.service.create(dto);
  }

  @Get(':id')
  @ApiParam(swagger.findOne.req.params.id)
  @ApiOkResponse(swagger.findOne.res.ok)
  @ApiUnauthorizedResponse(swagger.findOne.res.unauthorized)
  @UseInterceptors(ClassSerializerInterceptor)
  findOne(@Param('id', ParseIntPipe) id) {
    return this.service.findOne(+id);
  }

  @Patch(':id')
  @ApiParam(swagger.update.req.params.id)
  @ApiBody(swagger.update.req.body)
  @ApiOkResponse(swagger.update.res.ok)
  @ApiUnauthorizedResponse(swagger.update.res.unauthorized)
  @ApiBadRequestResponse(swagger.update.res.bad_request_email)
  @ApiBadRequestResponse(swagger.update.res.bad_request_password)
  @ApiUnprocessableEntityResponse(swagger.update.res.unprocessable)
  @ValidateNested()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @UseInterceptors(ClassSerializerInterceptor)
  update(@Param('id') id: string, @Body() dto: UpdatePermissionV1Dto) {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  @ApiParam(swagger.softDelete.req.params.id)
  @ApiOkResponse(swagger.softDelete.res.ok)
  @ApiUnauthorizedResponse(swagger.softDelete.res.unauthorized)
  @ApiUnprocessableEntityResponse(swagger.softDelete.res.unprocessable)
  softDelete(@Param('id', ParseIntPipe) id) {
    return this.service.softDelete(+id);
  }
}
