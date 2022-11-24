import {
  Controller,
  Get,
  UseInterceptors,
  ClassSerializerInterceptor,
  Param,
  Query, ParseIntPipe, Post, Body, Res, UsePipes, ValidationPipe
} from "@nestjs/common";
import { RoleService } from '../services/role.service';
import { CreateRoleDto } from "../dto/create-role.dto";
import { ValidateNested } from "class-validator";

@Controller({ path:"roles", version: '1', })
export class RoleV1Controller
{
  constructor(private readonly service: RoleService) {}

  @Get('search/:name')
  @UseInterceptors(ClassSerializerInterceptor)
  search(@Param('name') roleName) {
    return this.service.search(roleName);
  }

  @Get('/')
  @UseInterceptors(ClassSerializerInterceptor)
  findAll(@Query() query) {
    return this.service.findAll(query);
  }

  @Post('/')
  @ValidateNested()
  @UsePipes(ValidationPipe)
  @UseInterceptors(ClassSerializerInterceptor)
  async create(@Body() dto: CreateRoleDto): Promise<any> {
    return await this.service.create(dto);
  }

  @Get(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  findOne(@Param('id', ParseIntPipe) id) {
    return this.service.findOne(+id);
  }
}
