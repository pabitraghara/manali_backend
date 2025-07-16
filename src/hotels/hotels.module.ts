import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HotelsService } from './hotels.service';
import { HotelsController } from './hotels.controller';
import { HotelSchedulesController } from './hotel-schedules.controller';
import { Hotel } from './entities/hotel.entity';
import { HotelSchedule } from './entities/hotel-schedule.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Hotel, HotelSchedule])],
  controllers: [HotelsController, HotelSchedulesController],
  providers: [HotelsService],
  exports: [HotelsService],
})
export class HotelsModule {}