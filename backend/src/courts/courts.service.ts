import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Court } from './court.entity';
import { CreateCourtDto, QueryCourtDto } from './dto/court.dto';

@Injectable()
export class CourtsService {
  constructor(@InjectRepository(Court) private repo: Repository<Court>) {}

  async findAll(query: QueryCourtDto): Promise<Court[]> {
    const qb = this.repo.createQueryBuilder('c')
      .where('c.is_active = true')
      .orderBy('c.rating', 'DESC');
    if (query.sport_type) qb.andWhere('c.sport_type = :s', { s: query.sport_type });
    return qb.getMany();
  }

  async findOne(id: string): Promise<Court> {
    const court = await this.repo.findOne({ where: { id, is_active: true } });
    if (!court) throw new NotFoundException('Không tìm thấy sân');
    return court;
  }

  async create(ownerId: string, dto: CreateCourtDto): Promise<Court> {
    return this.repo.save(this.repo.create({ ...dto, owner_id: ownerId }));
  }

  async update(id: string, ownerId: string, dto: Partial<CreateCourtDto>): Promise<Court> {
    const court = await this.findOne(id);
    if (court.owner_id !== ownerId) throw new ForbiddenException('Không có quyền sửa sân này');
    await this.repo.update(id, dto);
    return this.findOne(id);
  }

  async delete(id: string, ownerId: string): Promise<void> {
    const court = await this.findOne(id);
    if (court.owner_id !== ownerId) throw new ForbiddenException('Không có quyền xoá sân này');
    await this.repo.update(id, { is_active: false });
  }
}