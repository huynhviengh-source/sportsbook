import { Court } from '../courts/court.entity';
import { User } from '../users/user.entity';
export declare class Review {
    id: string;
    court_id: string;
    court: Court;
    user_id: string;
    user: User;
    rating: number;
    comment: string;
    created_at: Date;
}
