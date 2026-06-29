import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './booking.entity';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { BookingsGateway } from '../gateway/bookings.gateway';
import { CourtsModule } from '../courts/courts.module';

@Module({
  imports: [TypeOrmModule.forFeature([Booking]), CourtsModule],
  providers: [BookingsService, BookingsGateway],
  controllers: [BookingsController],
})
export class BookingsModule {}