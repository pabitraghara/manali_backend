import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, AuthProvider } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = new User();
    user.id = await this.generateUniqueUserId(); // Generate 5-character ID
    user.email = createUserDto.email;
    user.name = createUserDto.name;
    user.role = createUserDto.role;
    user.provider = createUserDto.provider || AuthProvider.LOCAL;

    if (createUserDto.password) {
      user.password = await bcrypt.hash(createUserDto.password, 10);
    }

    if (createUserDto.googleId) {
      user.googleId = createUserDto.googleId;
    }

    if (createUserDto.avatar) {
      user.avatar = createUserDto.avatar;
    }

    return this.usersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({
      select: ['id', 'email', 'name', 'role', 'provider', 'avatar', 'isActive', 'createdAt'],
    });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      select: ['id', 'email', 'name', 'role', 'provider', 'avatar', 'isActive', 'createdAt'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { email },
    });
  }

  async findByGoogleId(googleId: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { googleId },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    Object.assign(user, updateUserDto);
    return this.usersRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.usersRepository.remove(user);
  }

  async validatePassword(user: User, password: string): Promise<boolean> {
    if (!user.password) return false;
    return bcrypt.compare(password, user.password);
  }

  private async generateUniqueUserId(): Promise<string> {
    let userId: string;
    let isUnique = false;
    
    while (!isUnique) {
      // Generate a 5-character alphanumeric ID
      userId = this.generateRandomId(5);
      
      // Check if this ID already exists
      const existingUser = await this.usersRepository.findOne({
        where: { id: userId },
      });
      
      if (!existingUser) {
        isUnique = true;
      }
    }
    
    return userId;
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