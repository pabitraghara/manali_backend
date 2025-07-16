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
import { PackageSchedule } from './package-schedule.entity';

export enum PackageStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  COMING_SOON = 'coming_soon',
}

export enum PackageType {
  ADVENTURE = 'adventure',
  FAMILY = 'family',
  ROMANTIC = 'romantic',
  BUDGET = 'budget',
  LUXURY = 'luxury',
  RELIGIOUS = 'religious',
}

@Entity('packages')
export class Package {
  @PrimaryColumn()
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column('text')
  description: string;

  @Column('text')
  highlights: string;

  @Column('text')
  itinerary: string;

  @Column('int')
  duration: number; // in days

  @Column('int')
  nights: number;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  originalPrice: number;

  @Column('int')
  maxGroupSize: number;

  @Column('int', { default: 1 })
  minGroupSize: number;

  @Column({
    type: 'enum',
    enum: PackageType,
    default: PackageType.FAMILY,
  })
  type: PackageType;

  @Column({
    type: 'enum',
    enum: PackageStatus,
    default: PackageStatus.ACTIVE,
  })
  status: PackageStatus;

  @Column('simple-array', { nullable: true })
  inclusions: string[];

  @Column('simple-array', { nullable: true })
  exclusions: string[];

  @Column('simple-array', { nullable: true })
  images: string[];

  @Column('simple-array', { nullable: true })
  destinations: string[];

  @Column('decimal', { precision: 3, scale: 2, default: 0 })
  rating: number;

  @Column('int', { default: 0 })
  reviewCount: number;

  @Column({ default: true })
  isActive: boolean;

  @Column('text', { nullable: true })
  terms: string;

  @Column('text', { nullable: true })
  cancellationPolicy: string;

  @ManyToOne(() => User, (user) => user.packages)
  @JoinColumn({ name: 'createdBy' })
  createdBy: User;

  @Column()
  createdById: string;

  @OneToMany(() => PackageSchedule, (schedule) => schedule.package)
  schedules: PackageSchedule[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}