import { IsInt, Min, Max, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty({ example: 5 })
  @IsInt() @Min(1) @Max(5)
  rating: number;

  @ApiPropertyOptional({ example: 'Sân rất đẹp, nhân viên thân thiện!' })
  @IsOptional() @IsString()
  comment?: string;
}