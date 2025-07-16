import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { HotelsModule } from "./hotels/hotels.module";
import { PackagesModule } from "./packages/packages.module";
import { ContactModule } from "./contact/contact.module";
import { User } from "./users/entities/user.entity";
import { Hotel } from "./hotels/entities/hotel.entity";
import { HotelSchedule } from "./hotels/entities/hotel-schedule.entity";
import { Package } from "./packages/entities/package.entity";
import { PackageSchedule } from "./packages/entities/package-schedule.entity";
import { PackageBooking } from "./packageBooking/entities/package-booking.entity";
import { PackageBookingsModule } from "./packageBooking/packageBooking.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT, 10),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [User, Hotel, HotelSchedule, Package, PackageSchedule, PackageBooking],
      synchronize: true,
      logging: false,
    }),
    AuthModule,
    UsersModule,
    HotelsModule,
    PackagesModule,
    ContactModule,
    PackageBookingsModule
  ],
})
export class AppModule {}
