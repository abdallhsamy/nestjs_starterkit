import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { RoleEntity } from './role.entity';

@Entity({ name: 'role_translations' })
@Unique(['lang', 'roleId'])
export class RoleTranslationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description: string;

  @Column({ type: 'longtext', nullable: true })
  longDescription: string;

  @Column()
  roleId: number;

  @Column({ type: 'varchar', length: 10 })
  lang: string;

  @ManyToOne(
    (type) => RoleEntity,
    (role: RoleEntity) => role.translations,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'roleId' })
  role: RoleEntity;
}
