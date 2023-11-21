import { Injectable } from '@nestjs/common';
import { BaseAbstractRepository } from '../base.abstract.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Auth } from '../../auth/auth.entity';
import { Repository } from 'typeorm';
import { AuthInterfaceRepository } from './auth.interface.repository';

@Injectable()
export class AuthRepository
  extends BaseAbstractRepository<Auth>
  implements AuthInterfaceRepository
{
  constructor(
    @InjectRepository(Auth) private readonly AuthRepository: Repository<Auth>,
  ) {
    super(AuthRepository);
  }
}
