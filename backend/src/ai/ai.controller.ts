import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AiService } from './ai.service';
import { CourtsService } from '../courts/courts.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

class ChatDto {
  @ApiProperty({ example: 'Tôi muốn tìm sân pickleball gần Quận 7' })
  @IsString()
  message: string;
}

class SuggestDto {
  @ApiProperty({ example: 'Muốn chơi cầu lông buổi sáng, giá rẻ' })
  @IsString()
  requirement: string;
}

class ReviewReplyDto {
  @ApiProperty({ example: 'Sân rất đẹp, nhân viên nhiệt tình' })
  @IsString()
  comment: string;

  @ApiProperty({ example: 5 })
  rating: number;

  @ApiProperty({ example: 'Sân Pickleball Quận 7' })
  @IsString()
  court_name: string;
}

@ApiTags('🤖 AI')
@Controller('ai')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AiController {
  constructor(
    private aiService: AiService,
    private courtsService: CourtsService,
  ) {}

  @Post('chat')
  @ApiOperation({ summary: 'Chatbot hỗ trợ khách hàng' })
  async chat(@Body() dto: ChatDto) {
    const courts = await this.courtsService.findAll({})
    const reply = await this.aiService.chat(dto.message, courts)
    return { reply }
  }

  @Post('suggest')
  @ApiOperation({ summary: 'Gợi ý sân thông minh theo yêu cầu' })
  async suggest(@Body() dto: SuggestDto) {
    const courts = await this.courtsService.findAll({})
    const suggested = await this.aiService.suggestCourts(dto.requirement, courts)
    return { courts: suggested }
  }

  @Post('review-reply')
  @ApiOperation({ summary: 'AI generate câu trả lời review' })
  async reviewReply(@Body() dto: ReviewReplyDto) {
    const reply = await this.aiService.generateReviewReply(
      dto.comment, dto.rating, dto.court_name
    )
    return { reply }
  }
}