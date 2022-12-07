import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude, Expose, Transform } from 'class-transformer';
import { RoleEntity } from '@src/modules/role/entities/role.entity';
import { PermissionActionsEnum } from '../enums/permission-actions.enum';

@Entity({ name: 'permissions' })
export class PermissionEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  model: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  action: PermissionActionsEnum;

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

  @Expose()
  get name() {
    return `${this.model}.${this.action}`;
  }

  @Exclude()
  @ManyToMany(() => RoleEntity)
  @JoinTable({
    name: 'permission_role',
    joinColumn: { name: 'permission_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
  })
  roles: RoleEntity[];
}
