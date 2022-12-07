import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RoleTranslationEntity } from './role-translation.entity';
import { Exclude, Expose, Transform } from 'class-transformer';
import { translation } from '@lib/utils/database';
import { PermissionEntity } from '@src/modules/permission/entities/permission.entity';

@Entity({ name: 'roles' })
export class RoleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ name: 'created_at', nullable: true })
  public created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  public updated_at: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  public deleted_at: Date;

  @Exclude()
  @OneToMany(
    (type) => RoleTranslationEntity,
    (roleTranslationEntity: RoleTranslationEntity) =>
      roleTranslationEntity.role,
    { eager: true },
  )
  @JoinColumn({ name: 'parentId' })
  translations: RoleTranslationEntity[];

  @Expose()
  get name() {
    return translation('name', this.translations);
  }

  @Expose()
  get description() {
    return translation('description', this.translations);
  }

  @Exclude()
  @ManyToMany(() => PermissionEntity)
  @JoinTable({
    name: 'permission_role',
    joinColumn: {
      name: 'role_id',
      referencedColumnName: 'id',
      foreignKeyConstraintName: 'fk_permission_role_role_id_roles_id',
    },
    inverseJoinColumn: {
      name: 'permission_id',
      referencedColumnName: 'id',
      foreignKeyConstraintName:
        'fk_permission_role_permission_id_permissions_id',
    },
  })
  permissions: PermissionEntity[];
}
