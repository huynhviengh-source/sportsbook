import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CourtsService } from './courts.service';
import { CreateCourtDto, QueryCourtDto } from './dto/court.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Courts')
@Controller('courts')
export class CourtsController {
  constructor(private svc: CourtsService) {}

  @Get()
  @ApiOperation({ summary: 'Danh sách sân' })
  findAll(@Query() q: QueryCourtDto) { return this.svc.findAll(q); }

  @Get(':id')
  @ApiOperation({ summary: 'Chi tiết sân' })
  findOne(@Param('id') id: string) { return this.svc.findOne(id); }

  @Post()
  @UseGuards(JwtAuthGuard) @ApiBearerAuth()
  @ApiOperation({ summary: 'Tạo sân mới' })
  create(@CurrentUser() u: any, @Body() dto: CreateCourtDto) {
    return this.svc.create(u.id, dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard) @ApiBearerAuth()
  @ApiOperation({ summary: 'Cập nhật sân' })
  update(@Param('id') id: string, @CurrentUser() u: any, @Body() dto: Partial<CreateCourtDto>) {
    return this.svc.update(id, u.id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard) @ApiBearerAuth()
  @ApiOperation({ summary: 'Xoá sân' })
  remove(@Param('id') id: string, @CurrentUser() u: any) {
    return this.svc.delete(id, u.id);
  }
}