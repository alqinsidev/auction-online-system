import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Timestamp,
} from 'typeorm';

@Entity()
export class DepositHistory {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column()
  user_id: string;

  @Column()
  amount: number;

  @Column({ default: false })
  isReturn: boolean;

  @CreateDateColumn()
  created_at: Timestamp;
}
