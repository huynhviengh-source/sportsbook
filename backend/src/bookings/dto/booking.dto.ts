import { IsString, IsInt, Min, Max, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookingDto {
  @ApiProperty({ example: 'uuid-của-sân' })
  @IsString()
  court_id: string;

  @ApiProperty({ example: '2026-07-10' })
  @IsDateString()
  booking_date: string;

  @ApiProperty({ example: 10 })
  @IsInt() @Min(6) @Max(22)
  start_hour: number;
}