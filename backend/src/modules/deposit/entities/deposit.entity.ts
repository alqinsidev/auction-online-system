import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Timestamp,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Deposit {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column()
  user_id: string;

  @Column()
  amount: number;

  @UpdateDateColumn()
  updated_at: Timestamp;
}
