import { Injectable } from '@nestjs/common';
import { BaseAbstractRepository } from '../base.abstract.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Workspace } from '../../workspace/workspace.entity';
import { WorkspaceInterfaceRepository } from './workspace.interface.repository';

@Injectable()
export class WorkspaceRepository
  extends BaseAbstractRepository<Workspace>
  implements WorkspaceInterfaceRepository
{
  constructor(
    @InjectRepository(Workspace)
    private readonly WorkspaceRepository: Repository<Workspace>,
  ) {
    super(WorkspaceRepository);
  }
}
