import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/booking.dto';
export declare class BookingsController {
    private svc;
    constructor(svc: BookingsService);
    getSlots(courtId: string, date: string): Promise<{}>;
    getMyBookings(u: any): Promise<{}>;
    create(u: any, dto: CreateBookingDto): Promise<import("./booking.entity").Booking>;
    cancel(id: string, u: any): Promise<import("./booking.entity").Booking>;
}
