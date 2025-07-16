import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PackagesService } from './packages.service';
import { PackagesController } from './packages.controller';
import { PackageSchedulesController } from './package-schedules.controller';
import { Package } from './entities/package.entity';
import { PackageSchedule } from './entities/package-schedule.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Package, PackageSchedule])],
  controllers: [PackagesController, PackageSchedulesController],
  providers: [PackagesService],
  exports: [PackagesService],
})
export class PackagesModule {}