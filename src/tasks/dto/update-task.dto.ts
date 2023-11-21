import { IsEnum, IsOptional } from 'class-validator';
import { TaskStatus } from '../task.entity';

export class UpdateTaskDto {
  @IsOptional()
  name: string;

  @IsOptional()
  description: string;

  @IsOptional()
  @IsEnum(TaskStatus)
  status: TaskStatus;
}
