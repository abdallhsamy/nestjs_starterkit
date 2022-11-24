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
  UpdateDateColumn
} from "typeorm";
import { Exclude, Expose, Transform } from 'class-transformer';
import { RoleEntity } from "@src/role/entities/role.entity";
import { PermissionActionsEnum } from "@src/permission/enums/permission-actions.enum";

@Entity({ name: 'permissions' })
export class PermissionEntity extends BaseEntity
{
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
    joinColumn : { name : 'permission_id', referencedColumnName: 'id', foreignKeyConstraintName:'permission_id_fk' },
    inverseJoinColumn : { name : 'role_id', referencedColumnName: 'id', foreignKeyConstraintName:'role_id_fk' }
  })
  roles: RoleEntity[];
}
