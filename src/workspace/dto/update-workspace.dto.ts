import { IsOptional } from 'class-validator';

export class UpdateWorkspaceDtoDto {
  @IsOptional()
  name: string;

  @IsOptional()
  description: string;

  @IsOptional()
  userIds: number[];
}
