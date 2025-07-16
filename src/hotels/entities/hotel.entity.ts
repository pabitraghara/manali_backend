import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { HotelSchedule } from './hotel-schedule.entity';

export enum HotelStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  MAINTENANCE = 'maintenance',
}

export enum HotelType {
  LUXURY = 'luxury',
  BUDGET = 'budget',
  PREMIUM = 'premium',
  RESORT = 'resort',
}

@Entity('hotels')
export class Hotel {
  @PrimaryColumn()
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column('text')
  description: string;

  @Column({ length: 255 })
  address: string;

  @Column({ length: 50 })
  city: string;

  @Column({ length: 50 })
  state: string;

  @Column({ length: 10 })
  pincode: string;

  @Column({ length: 15, nullable: true })
  phone: string;

  @Column({ length: 100, nullable: true })
  email: string;

  @Column('decimal', { precision: 10, scale: 2 })
  pricePerNight: number;

  @Column('int')
  totalRooms: number;

  @Column('int', { default: 0 })
  availableRooms: number;

  @Column({
    type: 'enum',
    enum: HotelType,
    default: HotelType.BUDGET,
  })
  type: HotelType;

  @Column({
    type: 'enum',
    enum: HotelStatus,
    default: HotelStatus.ACTIVE,
  })
  status: HotelStatus;

  @Column('simple-array', { nullable: true })
  amenities: string[];

  @Column('simple-array', { nullable: true })
  images: string[];

  @Column('decimal', { precision: 3, scale: 2, default: 0 })
  rating: number;

  @Column('int', { default: 0 })
  reviewCount: number;

  @Column('decimal', { precision: 10, scale: 6, nullable: true })
  latitude: number;

  @Column('decimal', { precision: 10, scale: 6, nullable: true })
  longitude: number;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => User, (user) => user.hotels)
  @JoinColumn({ name: 'createdBy' })
  createdBy: User;

  @Column()
  createdById: string;

  @OneToMany(() => HotelSchedule, (schedule) => schedule.hotel)
  schedules: HotelSchedule[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}