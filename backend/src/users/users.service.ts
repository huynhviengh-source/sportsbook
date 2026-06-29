import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async create(data: { email: string; password: string; full_name: string }): Promise<User> {
    const exists = await this.repo.findOne({ where: { email: data.email } });
    if (exists) throw new ConflictException('Email đã được sử dụng');
    const user = this.repo.create({ ...data, password: await bcrypt.hash(data.password, 10) });
    return this.repo.save(user);
  }

  findByEmail(email: string) { return this.repo.findOne({ where: { email } }); }
  findById(id: string) { return this.repo.findOne({ where: { id } }); }
}