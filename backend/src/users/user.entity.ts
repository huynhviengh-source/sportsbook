import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  full_name: string;

  @Column({ nullable: true })
  phone: string;

  @Column()
  password: string;

  @Column({ default: 'customer' })
  role: 'customer' | 'owner';

  @CreateDateColumn()
  created_at: Date;
}