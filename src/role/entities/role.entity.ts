import {
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
import { RoleTrEntity } from './role-tr.entity';
import { Exclude, Expose, Transform } from 'class-transformer';
import { translation } from '../../libs/utils/database';

@Entity({ name: 'roles' })
export class RoleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  mainImage: string;

  @Column({ type: 'text' })
  images: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  sku: string;

  @Column({ type: 'integer' })
  stockQuantity: string;

  @Column({ type: 'tinyint', default: 1 })
  status: number;

  @Column('decimal', { precision: 4, scale: 2, default: 0 })
  rate: number;

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
    (type) => RoleTrEntity,
    (roleTrEntity: RoleTrEntity) => roleTrEntity.role,
    { eager: true },
  )
  @JoinColumn({ name: 'parentId' })
  translations: RoleTrEntity[];

  @Expose()
  get name() {
    return translation('name', this.translations);
  }

  @Expose()
  get shortDescription() {
    return translation('shortDescription', this.translations);
  }

  @Expose()
  get longDescription() {
    return translation('longDescription', this.translations);
  }
}
