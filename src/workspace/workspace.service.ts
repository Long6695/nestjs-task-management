import { ConflictException, Injectable } from '@nestjs/common';
import { WorkspaceRepository } from '../repositories/workspace/workspace.repository';
import { User } from '../users/user.entity';
import { Workspace } from './workspace.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class WorkspaceService {
  constructor(
    private workspaceRepository: WorkspaceRepository,
    private usersService: UsersService,
  ) {}

  async create(
    workspace: Partial<Workspace>,
    userIds: number[],
    creatorId: number,
  ): Promise<Workspace> {
    const users = await this.usersService.findUsersByIds(userIds);

    const foundWorkspace = await this.workspaceRepository
      .createQueryBuilder('workspace')
      .leftJoinAndSelect('workspace.users', 'user')
      .where('user.id = :userId', { userId: creatorId })
      .andWhere('workspace.name = :workspaceName', {
        workspaceName: workspace.name,
      })
      .getOne();

    if (foundWorkspace) {
      throw new ConflictException('Workspace duplicated');
    }
    const newWorkspace = this.workspaceRepository.create({
      ...workspace,
      users,
    });

    return await this.workspaceRepository.save(newWorkspace);
  }

  async findOneById(workspaceId: number) {
    return this.workspaceRepository.findOneById(workspaceId);
  }

  async findAll({
    search,
    user,
  }: {
    search: string;
    user: User;
  }): Promise<Workspace[]> {
    const query = this.workspaceRepository
      .createQueryBuilder('workspace')
      .leftJoin('workspace.users', 'user')
      .where('user.id = :userId', { userId: user.id });

    if (search) {
      query.andWhere(
        '(LOWER(workspace.name) LIKE LOWER(:search) OR LOWER(workspace.description) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }
    return await query.getMany();
  }

  async update(user: User, data: Partial<Workspace>, workspaceId: number) {
    await this.workspaceRepository
      .createQueryBuilder('workspace')
      .leftJoin('workspace.users', 'user')
      .update()
      .set(data)
      .where('id = :id', { id: workspaceId })
      .andWhere('user.id = :userId', { userId: user.id })
      .execute();
    return this.workspaceRepository.findOneById(workspaceId);
  }
}
