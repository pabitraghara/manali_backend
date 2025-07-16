import { PartialType } from '@nestjs/swagger';
import { CreatePackageScheduleDto } from './create-package-schedule.dto';

export class UpdatePackageScheduleDto extends PartialType(CreatePackageScheduleDto) {}