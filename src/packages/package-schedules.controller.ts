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
import { PackagesService } from './packages.service';
import { CreatePackageScheduleDto } from './dto/create-package-schedule.dto';
import { UpdatePackageScheduleDto } from './dto/update-package-schedule.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Package Schedules')
@Controller('package-schedules')
export class PackageSchedulesController {
  constructor(private readonly packagesService: PackagesService) {}

  @ApiOperation({ summary: 'Create package schedule (Admin only)' })
  @ApiResponse({ status: 201, description: 'Schedule created successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() createScheduleDto: CreatePackageScheduleDto,
    @Request() req,
  ) {
    return this.packagesService.createSchedule(
      createScheduleDto.packageId,
      createScheduleDto,
      req.user,
    );
  }

  @ApiOperation({ summary: 'Get all package schedules' })
  @ApiQuery({ name: 'packageId', required: false, type: String })
  @ApiQuery({ name: 'startDate', required: false, type: String, example: '2024-12-01' })
  @ApiQuery({ name: 'endDate', required: false, type: String, example: '2024-12-31' })
  @ApiResponse({ status: 200, description: 'Schedules retrieved successfully' })
  @Get()
  findAll(
    @Query('packageId') packageId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    if (packageId) {
      return this.packagesService.getSchedules(packageId, startDate, endDate);
    }
    return this.packagesService.getAllSchedules(startDate, endDate);
  }

  @ApiOperation({ summary: 'Get package schedule by ID' })
  @ApiResponse({ status: 200, description: 'Schedule found' })
  @ApiResponse({ status: 404, description: 'Schedule not found' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.packagesService.findScheduleById(id);
  }

  @ApiOperation({ summary: 'Update package schedule (Admin only)' })
  @ApiResponse({ status: 200, description: 'Schedule updated successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateScheduleDto: UpdatePackageScheduleDto,
    @Request() req,
  ) {
    return this.packagesService.updateScheduleById(id, updateScheduleDto, req.user);
  }

  @ApiOperation({ summary: 'Delete package schedule (Admin only)' })
  @ApiResponse({ status: 200, description: 'Schedule deleted successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.packagesService.removeScheduleById(id, req.user);
  }
}