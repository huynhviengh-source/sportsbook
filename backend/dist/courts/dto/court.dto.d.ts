import { SportType } from '../court.entity';
export declare class CreateCourtDto {
    name: string;
    sport_type: SportType;
    address: string;
    price_per_hour: number;
    image_url?: string;
    description?: string;
}
export declare class QueryCourtDto {
    sport_type?: SportType;
}
