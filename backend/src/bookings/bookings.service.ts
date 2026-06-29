import {
  Injectable, NotFoundException, ForbiddenException,
  ConflictException, BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from './booking.entity';
import { CourtsService } from '../courts/courts.service';
import { BookingsGateway } from '../gateway/bookings.gateway';
import { CreateBookingDto } from './dto/booking.dto';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking) private repo: Repository<Booking>,
    private courtsService: CourtsService,
    private gateway: BookingsGateway,
  ) {}

  async getBookedSlots(courtId: string, date: string): Promise<number[]> {
    const rows = await this.repo.find({
      where: { court_id: courtId, booking_date: date, status: 'confirmed' },
      select: ['start_hour'],
    });
    return rows.map(r => r.start_hour);
  }

  async create(userId: string, dto: CreateBookingDto): Promise<Booking> {
    const court = await this.courtsService.findOne(dto.court_id);
    const today = new Date().toISOString().split('T')[0];
    if (dto.booking_date < today)
      throw new BadRequestException('Không thể đặt sân trong quá khứ');
    const dup = await this.repo.findOne({
      where: { court_id: dto.court_id, booking_date: dto.booking_date, start_hour: dto.start_hour, status: 'confirmed' },
    });
    if (dup) throw new ConflictException('Giờ này đã có người đặt rồi');
    const booking = await this.repo.save(this.repo.create({
      ...dto,
      user_id: userId,
      end_hour: dto.start_hour + 1,
      total_price: court.price_per_hour,
      status: 'confirmed',
    }));
    this.gateway.emitSlotBooked(dto.court_id, dto.booking_date, dto.start_hour);
    return booking;
  }

  async getMyBookings(userId: string): Promise<Booking[]> {
    return this.repo.find({
      where: { user_id: userId },
      relations: ['court'],
      order: { booking_date: 'DESC', start_hour: 'ASC' },
    });
  }

  async cancel(bookingId: string, userId: string): Promise<Booking> {
    const b = await this.repo.findOne({ where: { id: bookingId } });
    if (!b) throw new NotFoundException('Không tìm thấy lịch đặt');
    if (b.user_id !== userId) throw new ForbiddenException('Không có quyền huỷ');
    if (b.status === 'cancelled') throw new BadRequestException('Đã huỷ rồi');
    b.status = 'cancelled';
    const saved = await this.repo.save(b);
    this.gateway.emitSlotCancelled(b.court_id, b.booking_date, b.start_hour);
    return saved;
  }
}