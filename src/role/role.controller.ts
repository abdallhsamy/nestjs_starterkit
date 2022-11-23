import {
  Controller,
  Get,
  UseInterceptors,
  ClassSerializerInterceptor,
  Param,
  Query,
} from '@nestjs/common';
import { RoleService } from './role.service';

@Controller()
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get('roles/search/:name')
  @UseInterceptors(ClassSerializerInterceptor)
  search(@Param('name') roleName) {
    return this.roleService.search(roleName);
  }

  @Get('roles')
  @UseInterceptors(ClassSerializerInterceptor)
  findAll(@Query() query) {
    return this.roleService.findAll(query);
  }

  @Get('roles/:id')
  @UseInterceptors(ClassSerializerInterceptor)
  findOne(@Param('id') id) {
    return this.roleService.findOne(+id);
  }
}
