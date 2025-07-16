import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThanOrEqual } from 'typeorm';
import { Hotel } from './entities/hotel.entity';
import { HotelSchedule } from './entities/hotel-schedule.entity';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { UpdateHotelDto } from './dto/update-hotel.dto';
import { CreateHotelScheduleDto } from './dto/create-hotel-schedule.dto';
import { UpdateHotelScheduleDto } from './dto/update-hotel-schedule.dto';
import { User, UserRole } from '../users/entities/user.entity';

@Injectable()
export class HotelsService {
  constructor(
    @InjectRepository(Hotel)
    private readonly hotelRepository: Repository<Hotel>,
    @InjectRepository(HotelSchedule)
    private readonly hotelScheduleRepository: Repository<HotelSchedule>,
  ) {}

  async create(createHotelDto: CreateHotelDto, user: User): Promise<Hotel> {
    if (user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admins can create hotels');
    }

    const hotel = this.hotelRepository.create({
      ...createHotelDto,
      id: await this.generateUniqueHotelId(),
      createdById: user.id,
    });

    return await this.hotelRepository.save(hotel);
  }

  async findAll(page = 1, limit = 10, filters?: any): Promise<{ hotels: Hotel[]; total: number }> {
    const skip = (page - 1) * limit;
    const queryBuilder = this.hotelRepository
      .createQueryBuilder('hotel')
      .leftJoinAndSelect('hotel.createdBy', 'createdBy')
      .leftJoinAndSelect('hotel.schedules', 'schedules')
      .where('hotel.isActive = :isActive', { isActive: true });

    if (filters?.city) {
      queryBuilder.andWhere('LOWER(hotel.city) LIKE LOWER(:city)', {
        city: `%${filters.city}%`,
      });
    }

    if (filters?.type) {
      queryBuilder.andWhere('hotel.type = :type', { type: filters.type });
    }

    if (filters?.minPrice) {
      queryBuilder.andWhere('hotel.pricePerNight >= :minPrice', {
        minPrice: filters.minPrice,
      });
    }

    if (filters?.maxPrice) {
      queryBuilder.andWhere('hotel.pricePerNight <= :maxPrice', {
        maxPrice: filters.maxPrice,
      });
    }

    if (filters?.rating) {
      queryBuilder.andWhere('hotel.rating >= :rating', {
        rating: filters.rating,
      });
    }

    const [hotels, total] = await queryBuilder
      .orderBy('hotel.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return { hotels, total };
  }

  async findOne(id: string): Promise<Hotel> {
    const hotel = await this.hotelRepository.findOne({
      where: { id, isActive: true },
      relations: ['createdBy', 'schedules'],
    });

    if (!hotel) {
      throw new NotFoundException('Hotel not found');
    }

    return hotel;
  }

  async update(id: string, updateHotelDto: UpdateHotelDto, user: User): Promise<Hotel> {
    const hotel = await this.findOne(id);

    if (user.role !== UserRole.ADMIN && hotel.createdById !== user.id) {
      throw new ForbiddenException('You can only update your own hotels');
    }

    await this.hotelRepository.update(id, updateHotelDto);
    return await this.findOne(id);
  }

  async remove(id: string, user: User): Promise<void> {
    const hotel = await this.findOne(id);

    if (user.role !== UserRole.ADMIN && hotel.createdById !== user.id) {
      throw new ForbiddenException('You can only delete your own hotels');
    }

    await this.hotelRepository.update(id, { isActive: false });
  }

  // Hotel Schedule methods
  async createSchedule(
    hotelId: string,
    createScheduleDto: CreateHotelScheduleDto,
    user: User,
  ): Promise<HotelSchedule> {
    const hotel = await this.findOne(hotelId);

    if (user.role !== UserRole.ADMIN && hotel.createdById !== user.id) {
      throw new ForbiddenException('You can only create schedules for your own hotels');
    }

    // Check if schedule already exists for this date
    const existingSchedule = await this.hotelScheduleRepository.findOne({
      where: {
        hotelId,
        date: new Date(createScheduleDto.date),
        isActive: true,
      },
    });

    if (existingSchedule) {
      throw new BadRequestException('Schedule already exists for this date');
    }

    const schedule = this.hotelScheduleRepository.create({
      ...createScheduleDto,
      date: new Date(createScheduleDto.date),
      hotelId,
      createdById: user.id,
    });

    return await this.hotelScheduleRepository.save(schedule);
  }

  async getSchedules(
    hotelId: string,
    startDate?: string,
    endDate?: string,
  ): Promise<HotelSchedule[]> {
    const hotel = await this.findOne(hotelId);
    
    const queryBuilder = this.hotelScheduleRepository
      .createQueryBuilder('schedule')
      .where('schedule.hotelId = :hotelId', { hotelId })
      .andWhere('schedule.isActive = :isActive', { isActive: true });

    if (startDate && endDate) {
      queryBuilder.andWhere('schedule.date BETWEEN :startDate AND :endDate', {
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      });
    } else if (startDate) {
      queryBuilder.andWhere('schedule.date >= :startDate', {
        startDate: new Date(startDate),
      });
    }

    return await queryBuilder.orderBy('schedule.date', 'ASC').getMany();
  }

  async updateSchedule(
    hotelId: string,
    scheduleId: string,
    updateScheduleDto: UpdateHotelScheduleDto,
    user: User,
  ): Promise<HotelSchedule> {
    const hotel = await this.findOne(hotelId);

    if (user.role !== UserRole.ADMIN && hotel.createdById !== user.id) {
      throw new ForbiddenException('You can only update schedules for your own hotels');
    }

    const schedule = await this.hotelScheduleRepository.findOne({
      where: { id: parseInt(scheduleId), hotelId, isActive: true },
    });

    if (!schedule) {
      throw new NotFoundException('Schedule not found');
    }

    const updateData: any = { ...updateScheduleDto };
    if (updateScheduleDto.date) {
      updateData.date = new Date(updateScheduleDto.date);
    }

    await this.hotelScheduleRepository.update(parseInt(scheduleId), updateData);
    
    return await this.hotelScheduleRepository.findOne({
      where: { id: parseInt(scheduleId) },
    });
  }

  async removeSchedule(hotelId: string, scheduleId: string, user: User): Promise<void> {
    const hotel = await this.findOne(hotelId);

    if (user.role !== UserRole.ADMIN && hotel.createdById !== user.id) {
      throw new ForbiddenException('You can only delete schedules for your own hotels');
    }

    const schedule = await this.hotelScheduleRepository.findOne({
      where: { id: parseInt(scheduleId), hotelId, isActive: true },
    });

    if (!schedule) {
      throw new NotFoundException('Schedule not found');
    }

    await this.hotelScheduleRepository.update(scheduleId, { isActive: false });
  }

  async getAvailableHotels(checkIn: string, checkOut: string): Promise<Hotel[]> {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    const hotels = await this.hotelRepository
      .createQueryBuilder('hotel')
      .leftJoinAndSelect('hotel.schedules', 'schedule')
      .where('hotel.isActive = :isActive', { isActive: true })
      .andWhere('hotel.status = :status', { status: 'active' })
      .andWhere(
        '(schedule.date BETWEEN :checkIn AND :checkOut AND schedule.availableRooms > 0) OR schedule.id IS NULL',
        { checkIn: checkInDate, checkOut: checkOutDate },
      )
      .getMany();

    return hotels;
  }

  // Additional methods for standalone schedule management
  async getAllSchedules(startDate?: string, endDate?: string): Promise<HotelSchedule[]> {
    const queryBuilder = this.hotelScheduleRepository
      .createQueryBuilder('schedule')
      .leftJoinAndSelect('schedule.hotel', 'hotel')
      .where('schedule.isActive = :isActive', { isActive: true });

    if (startDate && endDate) {
      queryBuilder.andWhere('schedule.date BETWEEN :startDate AND :endDate', {
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      });
    } else if (startDate) {
      queryBuilder.andWhere('schedule.date >= :startDate', {
        startDate: new Date(startDate),
      });
    }

    return await queryBuilder.orderBy('schedule.date', 'ASC').getMany();
  }

  async findScheduleById(id: string): Promise<HotelSchedule> {
    const schedule = await this.hotelScheduleRepository.findOne({
      where: { id: parseInt(id), isActive: true },
      relations: ['hotel'],
    });

    if (!schedule) {
      throw new NotFoundException('Schedule not found');
    }

    return schedule;
  }

  async updateScheduleById(
    id: string,
    updateScheduleDto: UpdateHotelScheduleDto,
    user: User,
  ): Promise<HotelSchedule> {
    const schedule = await this.findScheduleById(id);
    const hotel = await this.findOne(schedule.hotelId);

    if (user.role !== UserRole.ADMIN && hotel.createdById !== user.id) {
      throw new ForbiddenException('You can only update schedules for your own hotels');
    }

    const { date, ...updateData } = updateScheduleDto;

    Object.assign(schedule, updateData);

    if (date) {
      schedule.date = new Date(date);
    }

    return await this.hotelScheduleRepository.save(schedule);
  }

  async removeScheduleById(id: string, user: User): Promise<void> {
    const schedule = await this.findScheduleById(id);
    const hotel = await this.findOne(schedule.hotelId);

    if (user.role !== UserRole.ADMIN && hotel.createdById !== user.id) {
      throw new ForbiddenException('You can only delete schedules for your own hotels');
    }

    schedule.isActive = false;
    await this.hotelScheduleRepository.save(schedule);
  }

  private async generateUniqueHotelId(): Promise<string> {
    let hotelId: string;
    let isUnique = false;
    
    while (!isUnique) {
      // Generate a 5-character numeric ID
      hotelId = this.generateRandomId(5);
      
      // Check if this ID already exists
      const existingHotel = await this.hotelRepository.findOne({
        where: { id: hotelId },
      });
      
      if (!existingHotel) {
        isUnique = true;
      }
    }
    
    return hotelId;
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