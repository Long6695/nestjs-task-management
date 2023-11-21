import { Injectable } from '@nestjs/common';
import { BaseAbstractRepository } from '../base.abstract.repository';
import { Task } from '../../tasks/task.entity';
import { TaskInterfaceRepository } from './task.interface.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TaskRepository
  extends BaseAbstractRepository<Task>
  implements TaskInterfaceRepository
{
  constructor(
    @InjectRepository(Task) private readonly TaskRepository: Repository<Task>,
  ) {
    super(TaskRepository);
  }
}
