import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { JwtAccessTokenGuard } from '../auth/guards/jwt-access-token.guard';
import { User } from '../users/user.entity';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ResponseMessage } from '../decorators/response.decorator';
import { TASK_MESSAGE } from '../constants/task';
import { HttpStatus } from '../constants/http-status';
import { WorkspaceService } from '../workspace/workspace.service';

@Controller('tasks')
@UseGuards(JwtAccessTokenGuard)
export class TasksController {
  constructor(
    private readonly tasksService: TasksService,
    private readonly workspaceService: WorkspaceService,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ResponseMessage(TASK_MESSAGE.GET_ALL)
  async findAll(
    @Query('search') search: string,
    @Query('status') status: string,
    @Req() req: { user: User },
  ): Promise<Task[]> {
    return this.tasksService.findAll({
      search,
      status,
      user: req.user,
    });
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage(TASK_MESSAGE.GET_ONE)
  async findOne(
    @Param('id') id: number,
    @Req() req: { user: User },
  ): Promise<Task> {
    const task = await this.tasksService.findOne(id, req.user);
    if (!task) {
      throw new NotFoundException('Task does not exist!');
    } else {
      return task;
    }
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ResponseMessage(TASK_MESSAGE.CREATE)
  async create(
    @Req() req: { user: User },
    @Body() createTaskDto: CreateTaskDto,
  ): Promise<Task> {
    const { workspaceId, ...data } = createTaskDto;
    const foundWorkspace = await this.workspaceService.findOneById(workspaceId);
    if (!foundWorkspace) {
      throw new NotFoundException('Workspace does not exist!');
    }
    return this.tasksService.create(req.user.id, data, foundWorkspace);
  }

  @Put(':id')
  @HttpCode(HttpStatus.CREATED)
  @ResponseMessage(TASK_MESSAGE.CREATE)
  async update(
    @Param('id') id: number,
    @Body() updateTaskDto: UpdateTaskDto,
    @Req() req: { user: User },
  ): Promise<any> {
    return this.tasksService.update(id, updateTaskDto, req.user);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage(TASK_MESSAGE.DELETE)
  async delete(
    @Param('id') id: number,
    @Req() req: { user: User },
  ): Promise<any> {
    const task = await this.tasksService.findOne(id, req.user);
    if (!task) {
      throw new NotFoundException('Task does not exist!');
    }
    return this.tasksService.delete(id);
  }
}
