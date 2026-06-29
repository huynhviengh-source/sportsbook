import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Court } from '../courts/court.entity';
import { User } from '../users/user.entity';

@Entity('reviews')
export class Review {
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

  @Column({ type: 'int' })
  rating: number;

  @Column({ nullable: true, type: 'text' })
  comment: string;

  @CreateDateColumn()
  created_at: Date;
}