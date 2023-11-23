import { Injectable } from '@nestjs/common';
import { Task } from './task.entity';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';
import { TaskRepository } from '../repositories/task/task.repository';
import { Workspace } from '../workspace/workspace.entity';

@Injectable()
export class TasksService {
  constructor(
    private taskRepository: TaskRepository,
    private usersService: UsersService,
  ) {}

  async findAll({
    search,
    status,
    user,
  }: {
    search: string;
    status: string;
    user: User;
  }): Promise<Task[]> {
    const query = this.taskRepository.createQueryBuilder('task');
    query.where({
      user,
    });

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        '(LOWER(task.name) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }
    return await query.getMany();
  }

  async findOne(id: number, user: User): Promise<Task> {
    return this.taskRepository.findOneByCondition({
      where: {
        id,
        user: {
          id: user.id,
        },
      },
    });
  }

  async create(
    userId: number,
    task: Partial<Task>,
    workspace: Workspace,
  ): Promise<Task> {
    const user = await this.usersService.findOne(userId);
    const newTask = this.taskRepository.create(task);
    newTask.user = user;
    newTask.workspace = workspace;
    return this.taskRepository.save(newTask);
  }

  async update(id: number, task: Partial<Task>, user: User): Promise<Task> {
    await this.taskRepository.update({ user, id }, task);
    return this.taskRepository.findOneById(id);
  }

  async delete(id: number): Promise<void> {
    await this.taskRepository.delete(id);
  }
}
