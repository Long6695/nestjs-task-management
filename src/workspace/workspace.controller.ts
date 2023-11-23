import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAccessTokenGuard } from '../auth/guards/jwt-access-token.guard';
import { WorkspaceService } from './workspace.service';
import { HttpStatus } from '../constants/http-status';
import { ResponseMessage } from '../decorators/response.decorator';
import { User } from '../users/user.entity';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { Workspace } from './workspace.entity';
import { WORKSPACE_MESSAGE } from '../constants/workspace';
import { UpdateWorkspaceDtoDto } from './dto/update-workspace.dto';

@Controller('workspace')
@UseGuards(JwtAccessTokenGuard)
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ResponseMessage(WORKSPACE_MESSAGE.GET_ALL)
  async findAll(
    @Query('search') search: string,
    @Req() req: { user: User },
  ): Promise<Workspace[]> {
    return this.workspaceService.findAll({
      search,
      user: req.user,
    });
  }
  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ResponseMessage(WORKSPACE_MESSAGE.CREATE)
  async create(
    @Req() req: { user: User },
    @Body() createWorkspaceDto: CreateWorkspaceDto,
  ): Promise<Workspace> {
    const { userIds, ...workspace } = createWorkspaceDto;
    return this.workspaceService.create(
      workspace,
      [req.user.id, ...userIds],
      req.user.id,
    );
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage(WORKSPACE_MESSAGE.UPDATE)
  async update(
    @Param('id') id: number,
    @Req() req: { user: User },
    @Body() updateWorkspaceDto: UpdateWorkspaceDtoDto,
  ): Promise<Workspace> {
    return this.workspaceService.update(req.user, updateWorkspaceDto, id);
  }
}
