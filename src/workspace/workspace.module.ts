import { Module } from '@nestjs/common';
import { WorkspaceController } from './workspace.controller';
import { WorkspaceService } from './workspace.service';
import { WorkspaceRepository } from '../repositories/workspace/workspace.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Workspace } from './workspace.entity';
import { UsersService } from '../users/users.service';
import { UserRepository } from '../repositories/user/user.repository';
import { User } from '../users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Workspace, User])],
  controllers: [WorkspaceController],
  providers: [
    WorkspaceService,
    WorkspaceRepository,
    UsersService,
    UserRepository,
  ],
})
export class WorkspaceModule {}
