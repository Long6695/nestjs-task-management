import { ConflictException, Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { hash } from 'bcrypt';
import { UserRepository } from '../repositories/user/user.repository';
import { In } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(private userRepository: UserRepository) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  async findOne(id: number): Promise<User> {
    return this.userRepository.findOneById(id);
  }

  async findByEmail(email: string): Promise<User> {
    return this.userRepository.findOneByCondition({ where: { email } });
  }

  async create(user: Partial<User>): Promise<User> {
    const foundUser = await this.findByEmail(user.email);
    if (foundUser) {
      throw new ConflictException('Email duplicated');
    }
    const newUser = this.userRepository.create({
      ...user,
      password: await hash(user.password, 10),
    });

    return await this.userRepository.save(newUser);
  }

  async update(id: number, user: Partial<User>): Promise<User> {
    await this.userRepository.update({ id }, user);
    return this.userRepository.findOneById(id);
  }

  async delete(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

  async findUsersByIds(ids: number[]): Promise<User[]> {
    return this.userRepository.findAll({ where: { id: In(ids) } });
  }
}
