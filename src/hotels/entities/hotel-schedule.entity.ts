import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Hotel } from './hotel.entity';
import { User } from '../../users/entities/user.entity';

export enum ScheduleStatus {
  AVAILABLE = 'available',
  BOOKED = 'booked',
  BLOCKED = 'blocked',
  MAINTENANCE = 'maintenance',
}

@Entity('hotel_schedules')
export class HotelSchedule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('date')
  date: Date;

  @Column('int')
  availableRooms: number;

  @Column('int', { default: 0 })
  bookedRooms: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  specialPrice: number;

  @Column({
    type: 'enum',
    enum: ScheduleStatus,
    default: ScheduleStatus.AVAILABLE,
  })
  status: ScheduleStatus;

  @Column('text', { nullable: true })
  notes: string;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => Hotel, (hotel) => hotel.schedules, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'hotelId' })
  hotel: Hotel;

  @Column()
  hotelId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'createdBy' })
  createdBy: User;

  @Column()
  createdById: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}