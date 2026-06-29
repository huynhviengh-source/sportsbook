import { Controller, Get, Post, Patch, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/booking.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Bookings')
@Controller('bookings')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class BookingsController {
  constructor(private svc: BookingsService) {}

  @Get('slots')
  @ApiOperation({ summary: 'Giờ đã đặt của 1 sân trong 1 ngày' })
  @ApiQuery({ name: 'court_id', type: String })
  @ApiQuery({ name: 'date', example: '2026-07-10' })
  getSlots(@Query('court_id') courtId: string, @Query('date') date: string) {
    return this.svc.getBookedSlots(courtId, date);
  }

  @Get('my')
  @ApiOperation({ summary: 'Lịch đặt của tôi' })
  getMyBookings(@CurrentUser() u: any) { return this.svc.getMyBookings(u.id); }

  @Post()
  @ApiOperation({ summary: 'Đặt sân' })
  create(@CurrentUser() u: any, @Body() dto: CreateBookingDto) {
    return this.svc.create(u.id, dto);
  }

  @Patch(':id/cancel')
  @ApiOperation({ summary: 'Huỷ lịch đặt' })
  cancel(@Param('id') id: string, @CurrentUser() u: any) {
    return this.svc.cancel(id, u.id);
  }
}