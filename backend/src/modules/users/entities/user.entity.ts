import { Deposit } from '../../deposit/entities/deposit.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  Timestamp,
} from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column()
  full_name: string;

  @Column()
  password: string;

  @Column()
  email: string;

  @CreateDateColumn()
  created_at: Timestamp;

  @OneToOne(() => Deposit)
  @JoinColumn({ name: 'id', referencedColumnName: 'user_id' })
  deposit: Deposit;
}
