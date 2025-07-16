import { PartialType } from '@nestjs/swagger';
import { CreateHotelScheduleDto } from './create-hotel-schedule.dto';

export class UpdateHotelScheduleDto extends PartialType(CreateHotelScheduleDto) {}