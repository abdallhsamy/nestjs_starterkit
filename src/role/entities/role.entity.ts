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
import { translation } from "@src/libs/utils/database";

@Entity({ name: 'roles' })
export class RoleEntity extends BaseEntity {
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
}
