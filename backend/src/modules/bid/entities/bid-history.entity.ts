import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  Timestamp,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { BidItem } from './bid-item.entity';

@Entity()
export class BidHistory {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;

  @Column()
  user_id: string;

  @Column()
  bid_id: string;

  @Column()
  bid_amount: number;

  @CreateDateColumn()
  created_at: Timestamp;

  @ManyToOne(() => BidItem, (bidItem) => bidItem.bid_history)
  @JoinColumn({ name: 'bid_id', referencedColumnName: 'id' })
  bid_item: BidItem;
}
