import { BaseInterfaceRepository } from '../base.interface.repository';
import { User } from '../../users/user.entity';

export interface UserInterfaceRepository
  extends BaseInterfaceRepository<User> {}
