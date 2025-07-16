// src/package-bookings/dto/create-package-booking.dto.ts

import {
    IsString,
    IsNotEmpty,
    IsEmail,
    IsDateString,
    IsInt,
    Min,
    IsOptional,
  } from 'class-validator';
  import { ApiProperty } from '@nestjs/swagger';
  
  export class CreatePackageBookingDto {
    @ApiProperty({ description: 'ID of the package being booked' })
    @IsString()
    @IsNotEmpty()
    packageId: string;
  
    @ApiProperty({ example: '2025-08-01', description: 'Start date of the package booking' })
    @IsDateString()
    startDate: Date;
  
    @ApiProperty({ example: '2025-08-05', description: 'End date of the package booking' })
    @IsDateString()
    endDate: Date;
  
    @ApiProperty({ example: 'John Doe', description: 'Name of the person booking the package' })
    @IsString()
    @IsNotEmpty()
    name: string;
  
    @ApiProperty({ example: 4, description: 'Number of people in the booking' })
    @IsInt()
    @Min(1)
    numberOfPeople: number;
  
    @ApiProperty({ example: '9876543210', description: 'Mobile number of the user' })
    @IsString()
    @IsNotEmpty()
    mobile: string;
  
      @ApiProperty({ example: 'john@example.com', description: 'Email address of the user' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'ID of the user making the booking', required: false })
  @IsString()
  @IsOptional()
  userId?: string;
  }
  