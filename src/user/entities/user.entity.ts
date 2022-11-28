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
import { Exclude, Expose, Transform } from 'class-transformer';
import { translation } from '@lib/utils/database';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column()
  phone_number: string;

  @Column()
  password: string;

  @Column({ nullable: true, type: 'date' })
  birth_date: Date;

  @Column()
  gender: string;

  @CreateDateColumn({ name: 'created_at', nullable: true })
  created_at: Date;

  @Column({ name: 'verified_at', nullable: true, type: 'timestamp' })
  verified_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updated_at: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deleted_at: Date;

  @Expose()
  get name() {
    return this.first_name + ' ' + this.last_name;
  }
}
