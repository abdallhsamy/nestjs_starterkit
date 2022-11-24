import {
  Controller,
  Get,
  UseInterceptors,
  ClassSerializerInterceptor,
  Param,
  Query, ParseIntPipe, Post, Body, Res, UsePipes, ValidationPipe, Patch, Delete
} from "@nestjs/common";
import { RoleService } from '../services/role.service';
import { CreateRoleDto } from "../dto/create-role.dto";
import { ValidateNested } from "class-validator";
import { UpdateRoleDto } from "../dto/update-role.dto";

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

  @Patch(':id')
  @ValidateNested()
  @UsePipes(new ValidationPipe({ whitelist:true }))
  @UseInterceptors(ClassSerializerInterceptor)
  update(@Param('id') id: string, @Body() dto: UpdateRoleDto) {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  softDelete(@Param('id', ParseIntPipe) id) {
    return this.service.softDelete(+id);
  }
}
