import { Repository } from 'typeorm';
import { Booking } from './booking.entity';
import { CourtsService } from '../courts/courts.service';
import { BookingsGateway } from '../gateway/bookings.gateway';
import { CreateBookingDto } from './dto/booking.dto';
export declare class BookingsService {
    private repo;
    private courtsService;
    private gateway;
    constructor(repo: Repository<Booking>, courtsService: CourtsService, gateway: BookingsGateway);
    getBookedSlots(courtId: string, date: string): Promise<number[]>;
    create(userId: string, dto: CreateBookingDto): Promise<Booking>;
    getMyBookings(userId: string): Promise<Booking[]>;
    cancel(bookingId: string, userId: string): Promise<Booking>;
}
