import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Timestamp,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { BidHistory } from './bid-history.entity';

@Entity()
export class BidItem {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;

  @OneToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'winner_id', referencedColumnName: 'id' })
  winner: User;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  user_id: string;

  @Column({ nullable: true, default: null })
  winner_id: string;

  @Column()
  start_price: number;

  @Column()
  last_price: number;

  @Column()
  time_window: number;

  @Column({ type: 'timestamp' })
  start_date: Timestamp;

  @Column({ type: 'timestamp' })
  end_date: Timestamp;

  @Column({ default: true })
  isDraft: boolean;

  @Column({ default: false })
  isCompleted: boolean;

  @CreateDateColumn()
  created_at: Timestamp;

  @UpdateDateColumn()
  updated_at: Timestamp;

  @OneToMany(() => BidHistory, (bidHistory) => bidHistory.bid_item)
  @JoinColumn({ name: 'id', referencedColumnName: 'bid_id' })
  bid_history: BidHistory[];
}
