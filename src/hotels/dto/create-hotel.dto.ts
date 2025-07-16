import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsEnum,
  IsArray,
  IsOptional,
  IsEmail,
  IsDecimal,
  IsBoolean,
  Min,
  Max,
  ArrayMinSize,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { HotelType, HotelStatus } from '../entities/hotel.entity';

export class CreateHotelDto {
  @ApiProperty({ example: 'Hotel Snow Peak' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Luxury hotel with mountain views in Manali' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 'Mall Road, Manali' })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({ example: 'Manali' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ example: 'Himachal Pradesh' })
  @IsString()
  @IsNotEmpty()
  state: string;

  @ApiProperty({ example: '175131' })
  @IsString()
  @IsNotEmpty()
  pincode: string;

  @ApiPropertyOptional({ example: '+91-1902-252000' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: 'info@snowpeak.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: 5000.00 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  pricePerNight: number;

  @ApiProperty({ example: 50 })
  @IsNumber()
  @Min(1)
  totalRooms: number;

  @ApiProperty({ example: 45 })
  @IsNumber()
  @Min(0)
  availableRooms: number;

  @ApiProperty({ enum: HotelType, example: HotelType.LUXURY })
  @IsEnum(HotelType)
  type: HotelType;

  @ApiPropertyOptional({ enum: HotelStatus, example: HotelStatus.ACTIVE })
  @IsOptional()
  @IsEnum(HotelStatus)
  status?: HotelStatus;

  @ApiPropertyOptional({
    example: ['WiFi', 'Swimming Pool', 'Spa', 'Restaurant', 'Room Service'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  amenities?: string[];

  @ApiPropertyOptional({
    example: ['hotel1.jpg', 'hotel2.jpg', 'hotel3.jpg'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @ApiPropertyOptional({ example: 4.5, minimum: 0, maximum: 5 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(5)
  rating?: number;

  @ApiPropertyOptional({ example: 120 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  reviewCount?: number;

  @ApiPropertyOptional({ example: 32.2396 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 6 })
  latitude?: number;

  @ApiPropertyOptional({ example: 77.1887 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 6 })
  longitude?: number;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}