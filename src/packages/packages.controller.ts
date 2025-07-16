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
import { PackagesService } from './packages.service';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import { CreatePackageScheduleDto } from './dto/create-package-schedule.dto';
import { UpdatePackageScheduleDto } from './dto/update-package-schedule.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('Packages')
@Controller('packages')
export class PackagesController {
  constructor(private readonly packagesService: PackagesService) {}

  @ApiOperation({ summary: 'Create a new package (Admin only)' })
  @ApiResponse({ status: 201, description: 'Package created successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post()
  create(@Body() createPackageDto: CreatePackageDto, @Request() req) {
    return this.packagesService.create(createPackageDto, req.user);
  }

  @ApiOperation({ summary: 'Get all packages with pagination and filters' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'type', required: false, type: String, example: 'adventure' })
  @ApiQuery({ name: 'minPrice', required: false, type: Number, example: 5000 })
  @ApiQuery({ name: 'maxPrice', required: false, type: Number, example: 20000 })
  @ApiQuery({ name: 'duration', required: false, type: Number, example: 4 })
  @ApiQuery({ name: 'destination', required: false, type: String, example: 'Manali' })
  @ApiQuery({ name: 'rating', required: false, type: Number, example: 4 })
  @ApiQuery({ name: 'isActive', required: false, type: String, example: 'true', description: 'Filter by active status (true/false)' })
  @ApiResponse({ status: 200, description: 'Packages retrieved successfully' })
  @Get()
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('type') type?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('duration') duration?: string,
    @Query('destination') destination?: string,
    @Query('rating') rating?: string,
    @Query('isActive') isActive?: string,
  ) {
    const pageNum = page && !isNaN(parseInt(page, 10)) ? parseInt(page, 10) : 1;
    const limitNum = limit && !isNaN(parseInt(limit, 10)) ? parseInt(limit, 10) : 10;
    
    const filters = {
      type,
      minPrice: minPrice && !isNaN(parseFloat(minPrice)) ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice && !isNaN(parseFloat(maxPrice)) ? parseFloat(maxPrice) : undefined,
      duration: duration && !isNaN(parseInt(duration, 10)) ? parseInt(duration, 10) : undefined,
      destination,
      rating: rating && !isNaN(parseFloat(rating)) ? parseFloat(rating) : undefined,
      isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined,
    };
    
    return this.packagesService.findAll(pageNum, limitNum, filters);
  }

  @ApiOperation({ summary: 'Get featured packages' })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 6 })
  @ApiResponse({ status: 200, description: 'Featured packages retrieved successfully' })
  @Get('featured')
  getFeatured(@Query('limit') limit?: string) {
    const limitNum = limit && !isNaN(parseInt(limit, 10)) ? parseInt(limit, 10) : 6;
    return this.packagesService.getFeaturedPackages(limitNum);
  }

  @ApiOperation({ summary: 'Get package by ID' })
  @ApiQuery({ name: 'includeInactive', required: false, type: String, example: 'false', description: 'Include inactive packages (true/false)' })
  @ApiResponse({ status: 200, description: 'Package found' })
  @ApiResponse({ status: 404, description: 'Package not found' })
  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Query('includeInactive') includeInactive?: string,
  ) {
    const includeInactiveFlag = includeInactive === 'true';
    return this.packagesService.findOne(id, includeInactiveFlag);
  }

  @ApiOperation({ summary: 'Update package (Admin or Owner only)' })
  @ApiResponse({ status: 200, description: 'Package updated successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin or Owner access required' })
  @ApiResponse({ status: 404, description: 'Package not found' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePackageDto: UpdatePackageDto,
    @Request() req,
  ) {
    return this.packagesService.update(id, updatePackageDto, req.user);
  }

  @ApiOperation({ summary: 'Delete package (Admin or Owner only)' })
  @ApiResponse({ status: 200, description: 'Package deleted successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin or Owner access required' })
  @ApiResponse({ status: 404, description: 'Package not found' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.packagesService.remove(id, req.user);
  }

  @ApiOperation({ summary: 'Reactivate package (Admin or Owner only)' })
  @ApiResponse({ status: 200, description: 'Package reactivated successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin or Owner access required' })
  @ApiResponse({ status: 404, description: 'Package not found' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id/reactivate')
  reactivate(@Param('id') id: string, @Request() req) {
    return this.packagesService.reactivate(id, req.user);
  }

  // Package Schedule endpoints
  @ApiOperation({ summary: 'Create package schedule (Admin or Owner only)' })
  @ApiResponse({ status: 201, description: 'Schedule created successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin or Owner access required' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':id/schedules')
  createSchedule(
    @Param('id') packageId: string,
    @Body() createScheduleDto: CreatePackageScheduleDto,
    @Request() req,
  ) {
    return this.packagesService.createSchedule(packageId, createScheduleDto, req.user);
  }

  @ApiOperation({ summary: 'Get package schedules' })
  @ApiQuery({ name: 'startDate', required: false, type: String, example: '2024-12-01' })
  @ApiQuery({ name: 'endDate', required: false, type: String, example: '2024-12-31' })
  @ApiResponse({ status: 200, description: 'Schedules retrieved successfully' })
  @Get(':id/schedules')
  getSchedules(
    @Param('id') packageId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.packagesService.getSchedules(packageId, startDate, endDate);
  }

  @ApiOperation({ summary: 'Update package schedule (Admin or Owner only)' })
  @ApiResponse({ status: 200, description: 'Schedule updated successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin or Owner access required' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id/schedules/:scheduleId')
  updateSchedule(
    @Param('id') packageId: string,
    @Param('scheduleId') scheduleId: string,
    @Body() updateScheduleDto: UpdatePackageScheduleDto,
    @Request() req,
  ) {
    return this.packagesService.updateSchedule(packageId, scheduleId, updateScheduleDto, req.user);
  }

  @ApiOperation({ summary: 'Delete package schedule (Admin or Owner only)' })
  @ApiResponse({ status: 200, description: 'Schedule deleted successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin or Owner access required' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id/schedules/:scheduleId')
  removeSchedule(
    @Param('id') packageId: string,
    @Param('scheduleId') scheduleId: string,
    @Request() req,
  ) {
    return this.packagesService.removeSchedule(packageId, scheduleId, req.user);
  }

  @ApiOperation({ summary: 'Get available packages for date range' })
  @ApiQuery({ name: 'startDate', required: true, type: String, example: '2024-12-25' })
  @ApiQuery({ name: 'endDate', required: false, type: String, example: '2024-12-28' })
  @ApiResponse({ status: 200, description: 'Available packages retrieved successfully' })
  @Get('available/search')
  getAvailablePackages(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.packagesService.getAvailablePackages(startDate, endDate);
  }

  @ApiOperation({ summary: 'Check package availability for specific dates' })
  @ApiQuery({ name: 'startDate', required: true, type: String, example: '2024-12-25' })
  @ApiQuery({ name: 'endDate', required: true, type: String, example: '2024-12-28' })
  @ApiResponse({ status: 200, description: 'Package availability retrieved successfully' })
  @Get(':id/availability')
  getPackageAvailability(
    @Param('id') packageId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.packagesService.getPackageAvailability(packageId, startDate, endDate);
  }
}