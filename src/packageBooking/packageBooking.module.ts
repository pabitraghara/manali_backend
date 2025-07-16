// src/package-bookings/package-bookings.module.ts

import { Module } from "@nestjs/common";
import { PackageBooking } from "./entities/package-booking.entity";
import { PackageBookingsService } from "./packageBooking.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PackageBookingController } from "./packageBooking.controller";
import { PackageSchedule } from "../packages/entities/package-schedule.entity";

@Module({
    imports: [TypeOrmModule.forFeature([PackageBooking, PackageSchedule])],
    providers: [PackageBookingsService],
    controllers: [PackageBookingController], // if using a controller
  })
  export class PackageBookingsModule {}
  