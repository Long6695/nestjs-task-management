import { BaseInterfaceRepository } from '../base.interface.repository';
import { Auth } from '../../auth/auth.entity';

export interface AuthInterfaceRepository
  extends BaseInterfaceRepository<Auth> {}
