import { RoleEntity } from '../../role/entities/role.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PermissionV1Service } from '@src/permission/services/permission-v1.service';
@Injectable()
export class RolePermissionV1Service {
  constructor(private readonly permissionService: PermissionV1Service) {}

  async assignPermissionsToRoles(role: RoleEntity, permissionsIds: number[]) {
    // check existance of permissions with their ids
    const permissions = await this.permissionService.getPermissionsByIds(
      permissionsIds,
    );
    if (!permissions || !permissions.length) throw new NotFoundException();

    // assign found permissions to role
    role.permissions = permissions;

    return role;
  }
}
