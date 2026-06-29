import { Repository } from 'typeorm';
import { Review } from './review.entity';
import { CreateReviewDto } from './dto/review.dto';
export declare class ReviewsService {
    private repo;
    constructor(repo: Repository<Review>);
    getByCourtId(courtId: string): Promise<Review[]>;
    create(userId: string, courtId: string, dto: CreateReviewDto): Promise<Review>;
    delete(id: string, userId: string): Promise<void>;
}
