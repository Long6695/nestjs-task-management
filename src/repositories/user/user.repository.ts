import { Injectable } from '@nestjs/common';
import { BaseAbstractRepository } from '../base.abstract.repository';
import { User } from '../../users/user.entity';
import { UserInterfaceRepository } from './user.interface.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserRepository
  extends BaseAbstractRepository<User>
  implements UserInterfaceRepository
{
  constructor(
    @InjectRepository(User) private readonly UserRepository: Repository<User>,
  ) {
    super(UserRepository);
  }
}
