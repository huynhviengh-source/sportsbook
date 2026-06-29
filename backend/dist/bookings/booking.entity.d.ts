import { Court } from '../courts/court.entity';
import { User } from '../users/user.entity';
export declare class Booking {
    id: string;
    court_id: string;
    court: Court;
    user_id: string;
    user: User;
    booking_date: string;
    start_hour: number;
    end_hour: number;
    total_price: number;
    status: 'confirmed' | 'cancelled';
    created_at: Date;
}
