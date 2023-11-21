import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksService } from './tasks.service';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';
import { Task } from './task.entity';
import { TaskRepository } from '../repositories/task/task.repository';
import { UserRepository } from '../repositories/user/user.repository';

@Module({
  imports: [TypeOrmModule.forFeature([User, Task])],
  controllers: [TasksController],
  providers: [TasksService, UsersService, TaskRepository, UserRepository],
})
export class TasksModule {}
