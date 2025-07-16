import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Package } from '../../packages/entities/package.entity'; // adjust path accordingly
import { User } from '../../users/entities/user.entity';

@Entity('package_bookings')
export class PackageBooking {
    @PrimaryGeneratedColumn()
    id: number;


    @Column()
    packageId: string;
    
    @ManyToOne(() => Package)
    @JoinColumn({ name: 'packageId' })
    package: Package;


    @Column({ type: 'date' })
    startDate: Date;

    @Column({ type: 'date' })
    endDate: Date;

    @Column()
    name: string;

    @Column('int')
    numberOfPeople: number;

    @Column()
    mobile: string;

    @Column()
    email: string;

    @Column({ nullable: true })
    userId: string;

    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: 'userId' })
    user: User;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
