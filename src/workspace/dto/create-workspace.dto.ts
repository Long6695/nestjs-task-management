import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateWorkspaceDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  description: string;

  @IsOptional()
  userIds: number[];
}
