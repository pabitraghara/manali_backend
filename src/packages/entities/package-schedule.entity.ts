import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Package } from './package.entity';
import { User } from '../../users/entities/user.entity';

export enum PackageScheduleStatus {
  AVAILABLE = 'available',
  BOOKED = 'booked',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
}

@Entity('package_schedules')
export class PackageSchedule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('date')
  startDate: Date;

  @Column('date')
  endDate: Date;

  @Column('int')
  availableSlots: number;

  @Column('int', { default: 0 })
  bookedSlots: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  specialPrice: number;

  @Column({
    type: 'enum',
    enum: PackageScheduleStatus,
    default: PackageScheduleStatus.AVAILABLE,
  })
  status: PackageScheduleStatus;

  @Column('text', { nullable: true })
  notes: string;

  @Column('text', { nullable: true })
  pickupLocation: string;

  @Column('time', { nullable: true })
  pickupTime: string;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => Package, (pkg) => pkg.schedules, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'packageId' })
  package: Package;

  @Column()
  packageId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'createdBy' })
  createdBy: User;

  @Column({ nullable: true })
  createdById: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}