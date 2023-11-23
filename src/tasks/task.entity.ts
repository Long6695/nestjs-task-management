import { Entity, Column, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';
import { Exclude } from 'class-transformer';
import { BaseEntity } from '../base.entity';
import { Workspace } from '../workspace/workspace.entity';

export enum TaskStatus {
  DONE = 'done',
  PROGRESS = 'progress',
  CANCEL = 'cancel',
}
@Entity()
export class Task extends BaseEntity {
  @Column()
  name: string;

  @Column()
  description: string;

  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.PROGRESS,
  })
  status: TaskStatus;

  @ManyToOne(() => User, (user) => user.tasks, { eager: false })
  @Exclude({ toPlainOnly: true })
  user: User;

  @ManyToOne(() => Workspace, (workspace) => workspace.tasks, { eager: false })
  @Exclude({ toPlainOnly: true })
  workspace: Workspace;
}
