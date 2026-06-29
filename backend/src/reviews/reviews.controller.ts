import { Controller, Get, Post, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/review.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Reviews')
@Controller('courts/:courtId/reviews')
export class ReviewsController {
  constructor(private svc: ReviewsService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy tất cả review của 1 sân' })
  getAll(@Param('courtId') courtId: string) {
    return this.svc.getByCourtId(courtId);
  }

  @Post()
  @UseGuards(JwtAuthGuard) @ApiBearerAuth()
  @ApiOperation({ summary: 'Thêm review' })
  create(
    @Param('courtId') courtId: string,
    @CurrentUser() u: any,
    @Body() dto: CreateReviewDto,
  ) {
    return this.svc.create(u.id, courtId, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard) @ApiBearerAuth()
  @ApiOperation({ summary: 'Xoá review' })
  delete(@Param('id') id: string, @CurrentUser() u: any) {
    return this.svc.delete(id, u.id);
  }
}