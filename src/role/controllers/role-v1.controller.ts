import {
  Controller,
  Get,
  UseInterceptors,
  ClassSerializerInterceptor,
  Param,
  Query, ParseIntPipe
} from "@nestjs/common";
import { RoleService } from '../services/role.service';

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

  @Get(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  findOne(@Param('id', ParseIntPipe) id) {
    return this.service.findOne(+id);
  }
}
