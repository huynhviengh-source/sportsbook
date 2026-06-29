import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/review.dto';
export declare class ReviewsController {
    private svc;
    constructor(svc: ReviewsService);
    getAll(courtId: string): Promise<{}>;
    create(courtId: string, u: any, dto: CreateReviewDto): Promise<import("./review.entity").Review>;
    delete(id: string, u: any): Promise<void>;
}
