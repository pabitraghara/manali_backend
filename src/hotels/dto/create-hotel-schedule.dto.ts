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
import { ScheduleStatus } from '../entities/hotel-schedule.entity';

export class CreateHotelScheduleDto {
  @ApiProperty({ example: '20001' })
  @IsString()
  @IsNotEmpty()
  hotelId: string;
  @ApiProperty({ example: '2024-12-25' })
  @IsDateString()
  @IsNotEmpty()
  date: string;

  @ApiProperty({ example: 10 })
  @IsNumber()
  @Min(0)
  availableRooms: number;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  bookedRooms?: number;

  @ApiPropertyOptional({ example: 6000.00 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  specialPrice?: number;

  @ApiPropertyOptional({ enum: ScheduleStatus, example: ScheduleStatus.AVAILABLE })
  @IsOptional()
  @IsEnum(ScheduleStatus)
  status?: ScheduleStatus;

  @ApiPropertyOptional({ example: 'Holiday special pricing' })
  @IsOptional()
  @IsString()
  notes?: string;
}