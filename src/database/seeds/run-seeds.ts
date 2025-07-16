import { DataSource } from 'typeorm';
import { ConfigModule } from '@nestjs/config';
import { seedAdminUser } from './admin.seed';
import { User } from '../../users/entities/user.entity';
import { Hotel } from '../../hotels/entities/hotel.entity';
import { HotelSchedule } from '../../hotels/entities/hotel-schedule.entity';
import { Package } from '../../packages/entities/package.entity';
import { PackageSchedule } from '../../packages/entities/package-schedule.entity';

ConfigModule.forRoot();

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT, 10),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [User, Hotel, HotelSchedule, Package, PackageSchedule],
  synchronize: false,
});

async function runSeeds() {
  try {
    await dataSource.initialize();

    await seedAdminUser(dataSource);

  } catch (error) {
    console.error('Error running seeds:', error);
  } finally {
    await dataSource.destroy();
  }
}

runSeeds();