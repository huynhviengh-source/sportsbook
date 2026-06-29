import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './review.entity';
import { CreateReviewDto } from './dto/review.dto';

@Injectable()
export class ReviewsService {
  constructor(@InjectRepository(Review) private repo: Repository<Review>) {}

  async getByCourtId(courtId: string): Promise<Review[]> {
    return this.repo.find({
      where: { court_id: courtId },
      relations: ['user'],
      order: { created_at: 'DESC' },
    });
  }

  async create(userId: string, courtId: string, dto: CreateReviewDto): Promise<Review> {
    const exists = await this.repo.findOne({ where: { court_id: courtId, user_id: userId } });
    if (exists) throw new ConflictException('Bạn đã review sân này rồi');

    const review = await this.repo.save(this.repo.create({
      court_id: courtId,
      user_id: userId,
      ...dto,
    }));

    // Cập nhật rating trung bình của sân
    const reviews = await this.repo.find({ where: { court_id: courtId } });
    const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await this.repo.manager.query(
      `UPDATE courts SET rating = $1 WHERE id = $2`,
      [Math.round(avg * 10) / 10, courtId]
    );

    return review;
  }

  async delete(id: string, userId: string): Promise<void> {
    const review = await this.repo.findOne({ where: { id } });
    if (!review) throw new NotFoundException('Không tìm thấy review');
    await this.repo.delete(id);
  }
}