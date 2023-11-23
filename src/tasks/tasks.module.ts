import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksService } from './tasks.service';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';
import { Task } from './task.entity';
import { TaskRepository } from '../repositories/task/task.repository';
import { UserRepository } from '../repositories/user/user.repository';
import { Workspace } from '../workspace/workspace.entity';
import { WorkspaceService } from '../workspace/workspace.service';
import { WorkspaceRepository } from '../repositories/workspace/workspace.repository';

@Module({
  imports: [TypeOrmModule.forFeature([User, Task, Workspace])],
  controllers: [TasksController],
  providers: [
    TasksService,
    UsersService,
    WorkspaceService,
    TaskRepository,
    UserRepository,
    WorkspaceRepository,
  ],
})
export class TasksModule {}
