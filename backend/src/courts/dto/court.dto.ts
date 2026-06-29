import { IsString, IsIn, IsInt, IsOptional, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SportType } from '../court.entity';

export class CreateCourtDto {
  @ApiProperty({ example: 'Sân Pickleball Quận 7' })
  @IsString()
  name: string;

  @ApiProperty({ enum: ['pickleball', 'badminton', 'tennis', 'football'] })
  @IsIn(['pickleball', 'badminton', 'tennis', 'football'])
  sport_type: SportType;

  @ApiProperty({ example: '12 Nguyễn Thị Thập, Q7, HCM' })
  @IsString()
  address: string;

  @ApiProperty({ example: 120000 })
  @IsInt() @Min(10000)
  price_per_hour: number;

  @ApiPropertyOptional()
  @IsOptional() @IsString()
  image_url?: string;

  @ApiPropertyOptional()
  @IsOptional() @IsString()
  description?: string;
}

export class QueryCourtDto {
  @ApiPropertyOptional({ enum: ['pickleball', 'badminton', 'tennis', 'football'] })
  @IsOptional()
  @IsIn(['pickleball', 'badminton', 'tennis', 'football'])
  sport_type?: SportType;
}