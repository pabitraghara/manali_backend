import { ApiQuery, ApiResponse, ApiTags, ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { BadRequestException, Body, Controller, Get, Post, Query, UseGuards, Param, ParseIntPipe, Request } from "@nestjs/common";
import { CreatePackageBookingDto } from "./package-booking.dto";
import { PackageBookingsService } from "./packageBooking.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";


@ApiTags('packageBooking')
@Controller('packages-booking')
export class PackageBookingController {
    constructor(
        private readonly packageBookingService: PackageBookingsService
    ) { }

    @ApiOperation({ summary: 'Create a new package booking' })
    @ApiResponse({ status: 201, description: 'Package booking successfully' })
    @Post('/purchase-package')
    purchasePackage(@Body() createPackageBookingDto: CreatePackageBookingDto) {
        try {
            return this.packageBookingService.purchasePackage(createPackageBookingDto);
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    // @ApiOperation({ summary: 'Get all bookings with user profiles (Admin only)' })
    // @ApiResponse({ status: 200, description: 'All bookings fetched successfully' })
    // @ApiBearerAuth()
    // @UseGuards(JwtAuthGuard)
    // @Get('/all-bookings')
    // async getAllBookings(@Request() req) {
    //     try {
    //         // Check if user is admin
    //         if (req.user.role !== 'admin') {
    //             throw new BadRequestException('Only admin can access all bookings');
    //         }
    //         return await this.packageBookingService.getAllBookings();
    //     } catch (error) {
    //         throw new BadRequestException(error.message);
    //     }
    // }

    // @ApiOperation({ summary: 'Get user bookings by email' })
    // @ApiResponse({ status: 200, description: 'User bookings fetched successfully' })
    // @ApiQuery({ name: 'email', required: true })
    // @ApiBearerAuth()
    // @UseGuards(JwtAuthGuard)
    // @Get('/user-bookings')
    // async getUserBookings(@Query('email') email: string, @Request() req) {
    //     try {
    //         // Users can only see their own bookings, admin can see any
    //         if (req.user.role !== 'admin' && req.user.email !== email) {
    //             throw new BadRequestException('You can only access your own bookings');
    //         }
    //         return await this.packageBookingService.getUserBookings(email);
    //     } catch (error) {
    //         throw new BadRequestException(error.message);
    //     }
    // }

    // @ApiOperation({ summary: 'Get user bookings by user ID' })
    // @ApiResponse({ status: 200, description: 'User bookings fetched successfully' })
    // @ApiBearerAuth()
    // @UseGuards(JwtAuthGuard)
    // @Get('/user/:userId/bookings')
    // async getUserBookingsByUserId(@Param('userId') userId: string, @Request() req) {
    //     try {
    //         // Users can only see their own bookings, admin can see any
    //         if (req.user.role !== 'admin' && req.user.id !== userId) {
    //             throw new BadRequestException('You can only access your own bookings');
    //         }
    //         return await this.packageBookingService.getUserBookingsByUserId(userId);
    //     } catch (error) {
    //         throw new BadRequestException(error.message);
    //     }
    // }

    @ApiOperation({ summary: 'Get my bookings (current user)' })
    @ApiResponse({ status: 200, description: 'My bookings fetched successfully' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Get('/my-bookings/:userId')
    async getMyBookings(@Request() req) {
        try {
            return await this.packageBookingService.getUserBookingsByUserId(req.user.id);

        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    // @ApiOperation({ summary: 'Get booking by ID with user profile' })
    // @ApiResponse({ status: 200, description: 'Booking fetched successfully' })
    // @ApiBearerAuth()
    // @UseGuards(JwtAuthGuard)
    // @Get('/booking/:id')
    // async getBookingById(@Param('id', ParseIntPipe) id: number, @Request() req) {
    //     try {
    //         const booking = await this.packageBookingService.getBookingById(id);

    //         // Users can only see their own bookings, admin can see any
    //         if (req.user.role !== 'admin' && 
    //             req.user.email !== booking.email && 
    //             req.user.id !== booking.userId) {
    //             throw new BadRequestException('You can only access your own bookings');
    //         }

    //         return booking;
    //     } catch (error) {
    //         throw new BadRequestException(error.message);
    //     }
    // }

    // @ApiOperation({ summary: 'Get bookings for a specific package (Admin only)' })
    // @ApiResponse({ status: 200, description: 'Package bookings fetched successfully' })
    // @ApiBearerAuth()
    // @UseGuards(JwtAuthGuard)
    // @Get('/package/:packageId/bookings')
    // async getPackageBookings(@Param('packageId') packageId: string, @Request() req) {
    //     try {
    //         // Check if user is admin
    //         if (req.user.role !== 'admin') {
    //             throw new BadRequestException('Only admin can access package bookings');
    //         }
    //         return await this.packageBookingService.getPackageBookings(packageId);
    //     } catch (error) {
    //         throw new BadRequestException(error.message);
    //     }
    // }


}