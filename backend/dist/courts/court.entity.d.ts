export type SportType = 'pickleball' | 'badminton' | 'tennis' | 'football';
export declare class Court {
    id: string;
    owner_id: string;
    name: string;
    sport_type: SportType;
    address: string;
    price_per_hour: number;
    image_url: string;
    description: string;
    rating: number;
    is_active: boolean;
    created_at: Date;
}
