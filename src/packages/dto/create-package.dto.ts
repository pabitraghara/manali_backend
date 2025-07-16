import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsEnum,
  IsArray,
  IsOptional,
  IsBoolean,
  IsDateString,
  Min,
  Max,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { PackageType, PackageStatus } from '../entities/package.entity';

export class CreatePackageScheduleDto {
  @ApiProperty({ example: '2024-03-15' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ example: '2024-03-19' })
  @IsDateString()
  endDate: string;

  @ApiProperty({ example: 20 })
  @IsNumber()
  @Min(1)
  availableSlots: number;

  @ApiPropertyOptional({ example: 18000.00 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  specialPrice?: number;

  @ApiPropertyOptional({ example: 'Hotel Snowview, Mall Road' })
  @IsOptional()
  @IsString()
  pickupLocation?: string;

  @ApiPropertyOptional({ example: '08:00' })
  @IsOptional()
  @IsString()
  pickupTime?: string;

  @ApiPropertyOptional({ example: 'Early morning departure recommended' })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class CreatePackageDto {
  @ApiProperty({ example: 'Manali Adventure Package' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Complete adventure package with trekking and river rafting' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 'Trekking, River Rafting, Paragliding, Local Sightseeing' })
  @IsString()
  @IsNotEmpty()
  highlights: string;

  @ApiProperty({ 
    example: 'Day 1: Arrival in Manali\nDay 2: Local sightseeing\nDay 3: Adventure activities\nDay 4: Departure' 
  })
  @IsString()
  @IsNotEmpty()
  itinerary: string;

  @ApiProperty({ example: 4 })
  @IsNumber()
  @Min(1)
  duration: number;

  @ApiProperty({ example: 3 })
  @IsNumber()
  @Min(0)
  nights: number;

  @ApiProperty({ example: 15000.00 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price: number;

  @ApiPropertyOptional({ example: 19000.00 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  originalPrice?: number;

  @ApiProperty({ example: 20 })
  @IsNumber()
  @Min(1)
  maxGroupSize: number;

  @ApiPropertyOptional({ example: 2 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  minGroupSize?: number;

  @ApiProperty({ enum: PackageType, example: PackageType.ADVENTURE })
  @IsEnum(PackageType)
  type: PackageType;

  @ApiPropertyOptional({ enum: PackageStatus, example: PackageStatus.ACTIVE })
  @IsOptional()
  @IsEnum(PackageStatus)
  status?: PackageStatus;

  @ApiPropertyOptional({
    example: ['Accommodation', 'Meals', 'Transportation', 'Adventure Activities', 'Guide'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  inclusions?: string[];

  @ApiPropertyOptional({
    example: ['Personal expenses', 'Tips', 'Travel insurance'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  exclusions?: string[];

  @ApiPropertyOptional({
    example: ['package1.jpg', 'package2.jpg', 'package3.jpg'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @ApiPropertyOptional({
    example: ['Manali', 'Solang Valley', 'Rohtang Pass', 'Kullu'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  destinations?: string[];

  @ApiPropertyOptional({ example: 4.2, minimum: 0, maximum: 5 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(5)
  rating?: number;

  @ApiPropertyOptional({ example: 85 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  reviewCount?: number;

  @ApiPropertyOptional({ example: 'Terms and conditions apply. Subject to weather conditions.' })
  @IsOptional()
  @IsString()
  terms?: string;

  @ApiPropertyOptional({ example: '50% refund if cancelled 7 days before. No refund if cancelled within 3 days.' })
  @IsOptional()
  @IsString()
  cancellationPolicy?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Package schedules with start and end dates',
    type: [CreatePackageScheduleDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePackageScheduleDto)
  schedules?: CreatePackageScheduleDto[];
}