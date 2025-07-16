import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThanOrEqual } from 'typeorm';
import { Package, PackageStatus } from './entities/package.entity';
import { PackageSchedule } from './entities/package-schedule.entity';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import { CreatePackageScheduleDto } from './dto/create-package-schedule.dto';
import { UpdatePackageScheduleDto } from './dto/update-package-schedule.dto';
import { User, UserRole } from '../users/entities/user.entity';

@Injectable()
export class PackagesService {
  constructor(
    @InjectRepository(Package)
    private readonly packageRepository: Repository<Package>,
    @InjectRepository(PackageSchedule)
    private readonly packageScheduleRepository: Repository<PackageSchedule>,
  ) {}

  async create(createPackageDto: CreatePackageDto, user: User): Promise<Package> {
    if (user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admins can create packages');
    }

    const { schedules, ...packageData } = createPackageDto;

    const packageEntity = this.packageRepository.create({
      ...packageData,
      id: await this.generateUniquePackageId(),
      createdById: user.id,
    });

    const savedPackage = await this.packageRepository.save(packageEntity);

    // Create schedules if provided
    if (schedules && schedules.length > 0) {
      const scheduleEntities = schedules.map(schedule => 
        this.packageScheduleRepository.create({
          ...schedule,
          packageId: savedPackage.id,
          createdById: user.id,
        })
      );
      await this.packageScheduleRepository.save(scheduleEntities);
    }

    return await this.packageRepository.findOne({
      where: { id: savedPackage.id },
      relations: ['schedules', 'createdBy'],
    });
  }

  async findAll(page = 1, limit = 10, filters?: any): Promise<{ packages: Package[]; total: number }> {
    const skip = (page - 1) * limit;
    const queryBuilder = this.packageRepository
      .createQueryBuilder('package')
      .leftJoinAndSelect('package.createdBy', 'createdBy')
      .leftJoinAndSelect('package.schedules', 'schedules');

    if (filters?.type) {
      queryBuilder.andWhere('package.type = :type', { type: filters.type });
    }

    if (filters?.minPrice) {
      queryBuilder.andWhere('package.price >= :minPrice', {
        minPrice: filters.minPrice,
      });
    }

    if (filters?.maxPrice) {
      queryBuilder.andWhere('package.price <= :maxPrice', {
        maxPrice: filters.maxPrice,
      });
    }

    if (filters?.duration) {
      queryBuilder.andWhere('package.duration = :duration', {
        duration: filters.duration,
      });
    }

    if (filters?.destination) {
      queryBuilder.andWhere('package.destinations @> :destination', {
        destination: [filters.destination],
      });
    }

    if (filters?.rating) {
      queryBuilder.andWhere('package.rating >= :rating', {
        rating: filters.rating,
      });
    }

    // Add filter for active/inactive status if specified
    if (filters?.isActive !== undefined) {
      queryBuilder.andWhere('package.isActive = :isActive', { isActive: filters.isActive });
    }

    const [packages, total] = await queryBuilder
      .orderBy('package.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return { packages, total };
  }

  async findOne(id: string, includeInactive = false): Promise<Package> {
    const whereCondition: any = { id };
    
    // Only filter by isActive if not including inactive packages
    if (!includeInactive) {
      whereCondition.isActive = true;
    }

    const packageEntity = await this.packageRepository.findOne({
      where: whereCondition,
      relations: ['createdBy', 'schedules'],
    });

    if (!packageEntity) {
      throw new NotFoundException('Package not found');
    }

    return packageEntity;
  }

  async update(id: string, updatePackageDto: UpdatePackageDto, user: User): Promise<Package> {
    const packageEntity = await this.findOne(id, true); // Include inactive packages for update

    if (user.role !== UserRole.ADMIN && packageEntity.createdById !== user.id) {
      throw new ForbiddenException('You can only update your own packages');
    }

    await this.packageRepository.update(id, updatePackageDto);
    return await this.findOne(id, true); // Include inactive packages for response
  }

  async remove(id: string, user: User): Promise<void> {
    const packageEntity = await this.findOne(id, true); // Include inactive packages for deletion check

    if (user.role !== UserRole.ADMIN && packageEntity.createdById !== user.id) {
      throw new ForbiddenException('You can only delete your own packages');
    }

    await this.packageRepository.update(id, { isActive: false });
  }

  // Method to reactivate a package
  async reactivate(id: string, user: User): Promise<Package> {
    const packageEntity = await this.findOne(id, true); // Include inactive packages

    if (user.role !== UserRole.ADMIN && packageEntity.createdById !== user.id) {
      throw new ForbiddenException('You can only reactivate your own packages');
    }

    await this.packageRepository.update(id, { isActive: true });
    return await this.findOne(id, true);
  }

  // Package Schedule methods
  async createSchedule(
    packageId: string,
    createScheduleDto: CreatePackageScheduleDto,
    user: User,
  ): Promise<PackageSchedule> {
    const packageEntity = await this.findOne(packageId, true); // Include inactive packages

    if (user.role !== UserRole.ADMIN && packageEntity.createdById !== user.id) {
      throw new ForbiddenException('You can only create schedules for your own packages');
    }

    const startDate = new Date(createScheduleDto.startDate);
    const endDate = new Date(createScheduleDto.endDate);

    if (startDate >= endDate) {
      throw new BadRequestException('End date must be after start date');
    }

    // Check for overlapping schedules
    const overlappingSchedule = await this.packageScheduleRepository
      .createQueryBuilder('schedule')
      .where('schedule.packageId = :packageId', { packageId })
      .andWhere('schedule.isActive = :isActive', { isActive: true })
      .andWhere(
        '(schedule.startDate <= :endDate AND schedule.endDate >= :startDate)',
        { startDate, endDate },
      )
      .getOne();

    if (overlappingSchedule) {
      throw new BadRequestException('Schedule overlaps with existing schedule');
    }

    const schedule = this.packageScheduleRepository.create({
      ...createScheduleDto,
      startDate,
      endDate,
      packageId,
      createdById: user.id,
    });

    return await this.packageScheduleRepository.save(schedule);
  }

  async getSchedules(
    packageId: string,
    startDate?: string,
    endDate?: string,
  ): Promise<PackageSchedule[]> {
    const packageEntity = await this.findOne(packageId, true); // Include inactive packages
    
    const queryBuilder = this.packageScheduleRepository
      .createQueryBuilder('schedule')
      .where('schedule.packageId = :packageId', { packageId })
      .andWhere('schedule.isActive = :isActive', { isActive: true });

    if (startDate && endDate) {
      queryBuilder.andWhere(
        '(schedule.startDate <= :endDate AND schedule.endDate >= :startDate)',
        {
          startDate: new Date(startDate),
          endDate: new Date(endDate),
        },
      );
    } else if (startDate) {
      queryBuilder.andWhere('schedule.endDate >= :startDate', {
        startDate: new Date(startDate),
      });
    }

    return await queryBuilder.orderBy('schedule.startDate', 'ASC').getMany();
  }

  async updateSchedule(
    packageId: string,
    scheduleId: string,
    updateScheduleDto: UpdatePackageScheduleDto,
    user: User,
  ): Promise<PackageSchedule> {
    const packageEntity = await this.findOne(packageId, true); // Include inactive packages

    if (user.role !== UserRole.ADMIN && packageEntity.createdById !== user.id) {
      throw new ForbiddenException('You can only update schedules for your own packages');
    }

    const schedule = await this.packageScheduleRepository.findOne({
      where: { id: parseInt(scheduleId), packageId, isActive: true },
    });

    if (!schedule) {
      throw new NotFoundException('Schedule not found');
    }

    const updateData: any = { ...updateScheduleDto };
    if (updateScheduleDto.startDate) {
      updateData.startDate = new Date(updateScheduleDto.startDate);
    }
    if (updateScheduleDto.endDate) {
      updateData.endDate = new Date(updateScheduleDto.endDate);
    }

    // Validate dates if both are being updated
    if (updateData.startDate && updateData.endDate && new Date(updateData.startDate) >= new Date(updateData.endDate)) {
      throw new BadRequestException('End date must be after start date');
    }

    await this.packageScheduleRepository.update(parseInt(scheduleId), updateData);
    
    return await this.packageScheduleRepository.findOne({
      where: { id: parseInt(scheduleId) },
    });
  }

  async removeSchedule(packageId: string, scheduleId: string, user: User): Promise<void> {
    const packageEntity = await this.findOne(packageId, true); // Include inactive packages

    if (user.role !== UserRole.ADMIN && packageEntity.createdById !== user.id) {
      throw new ForbiddenException('You can only delete schedules for your own packages');
    }

    const schedule = await this.packageScheduleRepository.findOne({
      where: { id: parseInt(scheduleId), packageId, isActive: true },
    });

    if (!schedule) {
      throw new NotFoundException('Schedule not found');
    }

    await this.packageScheduleRepository.update(scheduleId, { isActive: false });
  }

  async getAvailablePackages(startDate: string, endDate?: string): Promise<Package[]> {
    const queryStartDate = new Date(startDate);
    const queryEndDate = endDate ? new Date(endDate) : queryStartDate;

    // First, get all packages with their schedules
    const packages = await this.packageRepository
      .createQueryBuilder('package')
      .leftJoinAndSelect('package.schedules', 'schedule')
      .where('package.isActive = :isActive', { isActive: true })
      .andWhere('package.status = :status', { status: PackageStatus.ACTIVE })
      .getMany();

    // Filter packages that have available schedules for the date range
    const availablePackages = packages.map(pkg => {
      // Filter schedules that:
      // 1. Are active
      // 2. Overlap with the requested date range
      // 3. Have available slots (availableSlots - bookedSlots > 0)
      const availableSchedules = pkg.schedules.filter(schedule => {
        const scheduleStart = new Date(schedule.startDate);
        const scheduleEnd = new Date(schedule.endDate);
        const remainingSlots = schedule.availableSlots - schedule.bookedSlots;
        
        const dateOverlap = scheduleStart <= queryEndDate && scheduleEnd >= queryStartDate;
        const hasAvailableSlots = remainingSlots > 0;
        const isActive = schedule.isActive;
        
        // Log for debugging
        
        
        return dateOverlap && hasAvailableSlots && isActive;
      });
      
      return {
        ...pkg,
        schedules: availableSchedules
      };
    }).filter(pkg => pkg.schedules.length > 0); // Only return packages with available schedules

    return availablePackages;
  }

  async getPackageAvailability(packageId: string, startDate: string, endDate: string): Promise<{availableSlots: number, totalSlots: number}> {
    const schedule = await this.packageScheduleRepository.createQueryBuilder('schedule')
      .where('schedule.packageId = :packageId', { packageId })
      .andWhere('schedule.startDate <= :startDate', { startDate })
      .andWhere('schedule.endDate >= :endDate', { endDate })
      .andWhere('schedule.isActive = true')
      .getOne();

    if (!schedule) {
      return { availableSlots: 0, totalSlots: 0 };
    }

    const availableSlots = schedule.availableSlots - schedule.bookedSlots;
    return { 
      availableSlots: Math.max(0, availableSlots), 
      totalSlots: schedule.availableSlots 
    };
  }

  async getFeaturedPackages(limit = 6): Promise<Package[]> {
    return await this.packageRepository.find({
      where: { isActive: true, status: PackageStatus.ACTIVE },
      order: { rating: 'DESC', reviewCount: 'DESC' },
      take: limit,
      relations: ['schedules'],
    });
  }

  // Additional methods for standalone schedule management
  async getAllSchedules(startDate?: string, endDate?: string): Promise<PackageSchedule[]> {
    const queryBuilder = this.packageScheduleRepository
      .createQueryBuilder('schedule')
      .leftJoinAndSelect('schedule.package', 'package')
      .where('schedule.isActive = :isActive', { isActive: true });

    if (startDate && endDate) {
      queryBuilder.andWhere(
        '(schedule.startDate <= :endDate AND schedule.endDate >= :startDate)',
        {
          startDate: new Date(startDate),
          endDate: new Date(endDate),
        },
      );
    } else if (startDate) {
      queryBuilder.andWhere('schedule.endDate >= :startDate', {
        startDate: new Date(startDate),
      });
    }

    return await queryBuilder.orderBy('schedule.startDate', 'ASC').getMany();
  }

  async findScheduleById(id: string): Promise<PackageSchedule> {
    const schedule = await this.packageScheduleRepository.findOne({
      where: { id: parseInt(id), isActive: true },
      relations: ['package'],
    });

    if (!schedule) {
      throw new NotFoundException('Schedule not found');
    }

    return schedule;
  }

  async updateScheduleById(
    id: string,
    updateScheduleDto: UpdatePackageScheduleDto,
    user: User,
  ): Promise<PackageSchedule> {
    const schedule = await this.findScheduleById(id);
    const packageEntity = await this.findOne(schedule.packageId, true);

    if (user.role !== UserRole.ADMIN && packageEntity.createdById !== user.id) {
      throw new ForbiddenException('You can only update schedules for your own packages');
    }

    const { startDate, endDate, ...updateData } = updateScheduleDto;

    Object.assign(schedule, updateData);

    if (startDate) {
      schedule.startDate = new Date(startDate);
    }
    if (endDate) {
      schedule.endDate = new Date(endDate);
    }

    return await this.packageScheduleRepository.save(schedule);
  }

  async removeScheduleById(id: string, user: User): Promise<void> {
    const schedule = await this.findScheduleById(id);
    const packageEntity = await this.findOne(schedule.packageId, true);

    if (user.role !== UserRole.ADMIN && packageEntity.createdById !== user.id) {
      throw new ForbiddenException('You can only delete schedules for your own packages');
    }

    schedule.isActive = false;
    await this.packageScheduleRepository.save(schedule);
  }

  private async generateUniquePackageId(): Promise<string> {
    let packageId: string;
    let isUnique = false;
    
    while (!isUnique) {
      // Generate a 5-character numeric ID
      packageId = this.generateRandomId(5);
      
      // Check if this ID already exists
      const existingPackage = await this.packageRepository.findOne({
        where: { id: packageId },
      });
      
      if (!existingPackage) {
        isUnique = true;
      }
    }
    
    return packageId;
  }

  private generateRandomId(length: number): string {
    const chars = '0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
}