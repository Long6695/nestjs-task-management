import { BaseInterfaceRepository } from '../base.interface.repository';
import { Task } from '../../tasks/task.entity';

export interface TaskInterfaceRepository
  extends BaseInterfaceRepository<Task> {}
