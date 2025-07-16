import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { HotelsService } from './hotels.service';
import { CreateHotelScheduleDto } from './dto/create-hotel-schedule.dto';
import { UpdateHotelScheduleDto } from './dto/update-hotel-schedule.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Hotel Schedules')
@Controller('hotel-schedules')
export class HotelSchedulesController {
  constructor(private readonly hotelsService: HotelsService) {}

  @ApiOperation({ summary: 'Create hotel schedule (Admin only)' })
  @ApiResponse({ status: 201, description: 'Schedule created successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() createScheduleDto: CreateHotelScheduleDto,
    @Request() req,
  ) {
    return this.hotelsService.createSchedule(
      createScheduleDto.hotelId,
      createScheduleDto,
      req.user,
    );
  }

  @ApiOperation({ summary: 'Get all hotel schedules' })
  @ApiQuery({ name: 'hotelId', required: false, type: String })
  @ApiQuery({ name: 'startDate', required: false, type: String, example: '2024-12-01' })
  @ApiQuery({ name: 'endDate', required: false, type: String, example: '2024-12-31' })
  @ApiResponse({ status: 200, description: 'Schedules retrieved successfully' })
  @Get()
  findAll(
    @Query('hotelId') hotelId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    if (hotelId) {
      return this.hotelsService.getSchedules(hotelId, startDate, endDate);
    }
    return this.hotelsService.getAllSchedules(startDate, endDate);
  }

  @ApiOperation({ summary: 'Get hotel schedule by ID' })
  @ApiResponse({ status: 200, description: 'Schedule found' })
  @ApiResponse({ status: 404, description: 'Schedule not found' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.hotelsService.findScheduleById(id);
  }

  @ApiOperation({ summary: 'Update hotel schedule (Admin only)' })
  @ApiResponse({ status: 200, description: 'Schedule updated successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateScheduleDto: UpdateHotelScheduleDto,
    @Request() req,
  ) {
    return this.hotelsService.updateScheduleById(id, updateScheduleDto, req.user);
  }

  @ApiOperation({ summary: 'Delete hotel schedule (Admin only)' })
  @ApiResponse({ status: 200, description: 'Schedule deleted successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.hotelsService.removeScheduleById(id, req.user);
  }
}