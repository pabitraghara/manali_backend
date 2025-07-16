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
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { HotelsService } from './hotels.service';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { UpdateHotelDto } from './dto/update-hotel.dto';
import { CreateHotelScheduleDto } from './dto/create-hotel-schedule.dto';
import { UpdateHotelScheduleDto } from './dto/update-hotel-schedule.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('Hotels')
@Controller('hotels')
export class HotelsController {
  constructor(private readonly hotelsService: HotelsService) {}

  @ApiOperation({ summary: 'Create a new hotel (Admin only)' })
  @ApiResponse({ status: 201, description: 'Hotel created successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post()
  create(@Body() createHotelDto: CreateHotelDto, @Request() req) {
    return this.hotelsService.create(createHotelDto, req.user);
  }

  @ApiOperation({ summary: 'Get all hotels with pagination and filters' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'city', required: false, type: String, example: 'Manali' })
  @ApiQuery({ name: 'type', required: false, type: String, example: 'luxury' })
  @ApiQuery({ name: 'minPrice', required: false, type: Number, example: 1000 })
  @ApiQuery({ name: 'maxPrice', required: false, type: Number, example: 10000 })
  @ApiQuery({ name: 'rating', required: false, type: Number, example: 4 })
  @ApiResponse({ status: 200, description: 'Hotels retrieved successfully' })
  @Get()
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('city') city?: string,
    @Query('type') type?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('rating') rating?: string,
  ) {
    const pageNum = page && !isNaN(parseInt(page, 10)) ? parseInt(page, 10) : 1;
    const limitNum = limit && !isNaN(parseInt(limit, 10)) ? parseInt(limit, 10) : 10;
    
    const filters = {
      city,
      type,
      minPrice: minPrice && !isNaN(parseFloat(minPrice)) ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice && !isNaN(parseFloat(maxPrice)) ? parseFloat(maxPrice) : undefined,
      rating: rating && !isNaN(parseFloat(rating)) ? parseFloat(rating) : undefined,
    };
    
    return this.hotelsService.findAll(pageNum, limitNum, filters);
  }

  @ApiOperation({ summary: 'Get hotel by ID' })
  @ApiResponse({ status: 200, description: 'Hotel found' })
  @ApiResponse({ status: 404, description: 'Hotel not found' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.hotelsService.findOne(id);
  }

  @ApiOperation({ summary: 'Update hotel (Admin or Owner only)' })
  @ApiResponse({ status: 200, description: 'Hotel updated successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin or Owner access required' })
  @ApiResponse({ status: 404, description: 'Hotel not found' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateHotelDto: UpdateHotelDto,
    @Request() req,
  ) {
    return this.hotelsService.update(id, updateHotelDto, req.user);
  }

  @ApiOperation({ summary: 'Delete hotel (Admin or Owner only)' })
  @ApiResponse({ status: 200, description: 'Hotel deleted successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin or Owner access required' })
  @ApiResponse({ status: 404, description: 'Hotel not found' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.hotelsService.remove(id, req.user);
  }

  // Hotel Schedule endpoints
  @ApiOperation({ summary: 'Create hotel schedule (Admin or Owner only)' })
  @ApiResponse({ status: 201, description: 'Schedule created successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin or Owner access required' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':id/schedules')
  createSchedule(
    @Param('id') hotelId: string,
    @Body() createScheduleDto: CreateHotelScheduleDto,
    @Request() req,
  ) {
    return this.hotelsService.createSchedule(hotelId, createScheduleDto, req.user);
  }

  @ApiOperation({ summary: 'Get hotel schedules' })
  @ApiQuery({ name: 'startDate', required: false, type: String, example: '2024-12-01' })
  @ApiQuery({ name: 'endDate', required: false, type: String, example: '2024-12-31' })
  @ApiResponse({ status: 200, description: 'Schedules retrieved successfully' })
  @Get(':id/schedules')
  getSchedules(
    @Param('id') hotelId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.hotelsService.getSchedules(hotelId, startDate, endDate);
  }

  @ApiOperation({ summary: 'Update hotel schedule (Admin or Owner only)' })
  @ApiResponse({ status: 200, description: 'Schedule updated successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin or Owner access required' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id/schedules/:scheduleId')
  updateSchedule(
    @Param('id') hotelId: string,
    @Param('scheduleId') scheduleId: string,
    @Body() updateScheduleDto: UpdateHotelScheduleDto,
    @Request() req,
  ) {
    return this.hotelsService.updateSchedule(hotelId, scheduleId, updateScheduleDto, req.user);
  }

  @ApiOperation({ summary: 'Delete hotel schedule (Admin or Owner only)' })
  @ApiResponse({ status: 200, description: 'Schedule deleted successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin or Owner access required' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id/schedules/:scheduleId')
  removeSchedule(
    @Param('id') hotelId: string,
    @Param('scheduleId') scheduleId: string,
    @Request() req,
  ) {
    return this.hotelsService.removeSchedule(hotelId, scheduleId, req.user);
  }

  @ApiOperation({ summary: 'Get available hotels for date range' })
  @ApiQuery({ name: 'checkIn', required: true, type: String, example: '2024-12-25' })
  @ApiQuery({ name: 'checkOut', required: true, type: String, example: '2024-12-28' })
  @ApiResponse({ status: 200, description: 'Available hotels retrieved successfully' })
  @Get('available/search')
  getAvailableHotels(
    @Query('checkIn') checkIn: string,
    @Query('checkOut') checkOut: string,
  ) {
    return this.hotelsService.getAvailableHotels(checkIn, checkOut);
  }
}