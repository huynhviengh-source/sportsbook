import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export type SportType = 'pickleball' | 'badminton' | 'tennis' | 'football';

@Entity('courts')
export class Court {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  owner_id: string;

  @Column()
  name: string;

  @Column()
  sport_type: SportType;

  @Column()
  address: string;

  @Column({ type: 'int' })
  price_per_hour: number;

  @Column({ nullable: true })
  image_url: string;

  @Column({ nullable: true, type: 'text' })
  description: string;

  @Column({ type: 'decimal', precision: 2, scale: 1, default: 5.0 })
  rating: number;

  @Column({ default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;
}