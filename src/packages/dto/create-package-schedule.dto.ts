import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsEnum,
  IsOptional,
  IsDateString,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PackageScheduleStatus } from '../entities/package-schedule.entity';

export class CreatePackageScheduleDto {
  @ApiProperty({ example: '10001' })
  @IsString()
  @IsNotEmpty()
  packageId: string;
  @ApiProperty({ example: '2024-12-25' })
  @IsDateString()
  @IsNotEmpty()
  startDate: Date;

  @ApiProperty({ example: '2024-12-28' })
  @IsDateString()
  @IsNotEmpty()
  endDate: string;

  @ApiProperty({ example: 15 })
  @IsNumber()
  @Min(1)
  availableSlots: number;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  bookedSlots?: number;

  @ApiPropertyOptional({ example: 16000.00 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  specialPrice?: number;

  @ApiPropertyOptional({ enum: PackageScheduleStatus, example: PackageScheduleStatus.AVAILABLE })
  @IsOptional()
  @IsEnum(PackageScheduleStatus)
  status?: PackageScheduleStatus;

  @ApiPropertyOptional({ example: 'Holiday special package with extra activities' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ example: 'Mall Road, Manali' })
  @IsOptional()
  @IsString()
  pickupLocation?: string;

  @ApiPropertyOptional({ example: '06:00:00' })
  @IsOptional()
  @IsString()
  pickupTime?: string;
}