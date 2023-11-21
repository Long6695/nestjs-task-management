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

@Controller('tasks')
@UseGuards(JwtAccessTokenGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ResponseMessage(TASK_MESSAGE.GET_ALL)
  async findAll(
    @Param('search') search: string,
    @Param('status') status: string,
    @Req() req: { user: User },
  ): Promise<Task[]> {
    return this.tasksService.findAll({ search, status, user: req.user });
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
    return this.tasksService.create(req.user.id, createTaskDto);
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
