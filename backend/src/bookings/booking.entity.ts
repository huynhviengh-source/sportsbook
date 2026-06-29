import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { Court } from '../courts/court.entity';
import { User } from '../users/user.entity';

@Entity('bookings')
@Unique(['court_id', 'booking_date', 'start_hour'])
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  court_id: string;

  @ManyToOne(() => Court)
  @JoinColumn({ name: 'court_id' })
  court: Court;

  @Column()
  user_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'date' })
  booking_date: string;

  @Column({ type: 'int' })
  start_hour: number;

  @Column({ type: 'int' })
  end_hour: number;

  @Column({ type: 'int' })
  total_price: number;

  @Column({ default: 'confirmed' })
  status: 'confirmed' | 'cancelled';

  @CreateDateColumn()
  created_at: Date;
}