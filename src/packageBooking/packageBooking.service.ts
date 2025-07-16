// src/package-bookings/package-bookings.service.ts

import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PackageBooking } from "./entities/package-booking.entity";
import { Repository } from "typeorm";
import { CreatePackageBookingDto } from "./package-booking.dto";
import { PackageSchedule } from "../packages/entities/package-schedule.entity";


@Injectable()
export class PackageBookingsService {
    constructor(
        @InjectRepository(PackageBooking)
        private readonly bookingRepo: Repository<PackageBooking>,
        @InjectRepository(PackageSchedule)
        private readonly scheduleRepo: Repository<PackageSchedule>,
    ) { }

    async purchasePackage(createDto: CreatePackageBookingDto): Promise<PackageBooking> {
        try {
            // Find the appropriate schedule that covers the booking dates
            const schedule = await this.scheduleRepo.createQueryBuilder('schedule')
                .where('schedule.packageId = :packageId', { packageId: createDto.packageId })
                .andWhere('schedule.startDate <= :startDate', { startDate: createDto.startDate })
                .andWhere('schedule.endDate >= :endDate', { endDate: createDto.endDate })
                .andWhere('schedule.isActive = true')
                .andWhere('(schedule.availableSlots - schedule.bookedSlots) >= :numberOfPeople', { numberOfPeople: createDto.numberOfPeople })
                .getOne();

            if (!schedule) {
                throw new BadRequestException('No available slots for the selected dates and number of people');
            }

            // Check if there are enough available slots
            const remainingSlots = schedule.availableSlots - schedule.bookedSlots;
            if (remainingSlots < createDto.numberOfPeople) {
                throw new BadRequestException(`Only ${remainingSlots} slots available, but ${createDto.numberOfPeople} requested`);
            }

            // Create the booking
            const booking = this.bookingRepo.create(createDto);
            const savedBooking = await this.bookingRepo.save(booking);

            // Update the schedule to increment booked slots
            await this.scheduleRepo.update(schedule.id, {
                bookedSlots: schedule.bookedSlots + createDto.numberOfPeople
            });

            return savedBooking;
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }
    // Get all bookings with user profiles (Admin only)
    async getAllBookings(): Promise<PackageBooking[]> {
        try {
            return await this.bookingRepo.createQueryBuilder('booking')
                .leftJoinAndSelect('booking.package', 'package')
                .leftJoinAndSelect('booking.user', 'user')
                .orderBy('booking.createdAt', 'DESC')
                .getMany();
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    // Get user bookings by email
    async getUserBookings(email: string): Promise<PackageBooking[]> {
        try {
            return await this.bookingRepo.createQueryBuilder('booking')
                .leftJoinAndSelect('booking.package', 'package')
                .leftJoinAndSelect('booking.user', 'user')
                .where('booking.email = :email', { email })
                .orderBy('booking.createdAt', 'DESC')
                .getMany();
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    // Get user bookings by userId
    async getUserBookingsByUserId(userId: string): Promise<PackageBooking[]> {
        try {
            return await this.bookingRepo.createQueryBuilder('booking')
                .leftJoinAndSelect('booking.package', 'package')
                .leftJoinAndSelect('booking.user', 'user')
                .where('booking.userId = :userId', { userId })
                .orderBy('booking.createdAt', 'DESC')
                .getMany();
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }
    

    // Get booking by ID with user profile
    // async getBookingById(id: number): Promise<PackageBooking> {
    //     try {
    //         const booking = await this.bookingRepo.createQueryBuilder('booking')
    //             .leftJoinAndSelect('booking.package', 'package')
    //             .leftJoinAndSelect('booking.user', 'user')
    //             .where('booking.id = :id', { id })
    //             .getOne();
            
    //         if (!booking) {
    //             throw new BadRequestException('Booking not found');
    //         }
            
    //         return booking;
    //     } catch (error) {
    //         throw new BadRequestException(error.message);
    //     }
    // }

    // Get bookings for a specific package
    // async getPackageBookings(packageId: string): Promise<PackageBooking[]> {
    //     try {
    //         return await this.bookingRepo.createQueryBuilder('booking')
    //             .leftJoinAndSelect('booking.package', 'package')
    //             .leftJoinAndSelect('booking.user', 'user')
    //             .where('booking.packageId = :packageId', { packageId })
    //             .orderBy('booking.createdAt', 'DESC')
    //             .getMany();
    //     } catch (error) {
    //         throw new BadRequestException(error.message);
    //     }
    // }


    }
