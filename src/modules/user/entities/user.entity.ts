import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude, Expose } from 'class-transformer';
import { EmailVerificationTokenEntity } from '@src/modules/auth/entities/email-verification-token.entity';
import { ForgetPasswordTokenEntity } from '@src/modules/auth/entities/forget-password-token.entity';

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

  @Exclude()
  @OneToMany(
    () => EmailVerificationTokenEntity,
    (emailVerificationToken) => emailVerificationToken.user,
    {
      onDelete: 'CASCADE',
    },
  )
  emailVerificationTokens: EmailVerificationTokenEntity[];

  @Exclude()
  @OneToMany(
    () => ForgetPasswordTokenEntity,
    (forgetPasswordToken) => forgetPasswordToken.user,
  )
  forgetPasswordTokens: ForgetPasswordTokenEntity[];

  @Expose()
  get name() {
    return this.first_name + ' ' + this.last_name;
  }
}
