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
import { translation } from "@lib/utils/database";
import { IsNotEmpty, IsString } from "class-validator";

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @IsString()
  @IsNotEmpty()
  email : string;

  @IsString()
  @IsNotEmpty()
  first_name : string;

  @IsString()
  // @IsNotEmpty()
  last_name : string;

  @IsString()
  // @IsNotEmpty()
  phone_number : string;

  @IsString()
  // @IsNotEmpty()
  password : string;

  @Column({ nullable: true, type: 'date' })
  birth_date: Date;

  @IsString()
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
