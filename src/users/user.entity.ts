import { Entity, Column, OneToMany, ManyToMany } from 'typeorm';
import { Task } from '../tasks/task.entity';
import { BaseEntity } from '../base.entity';
import { Workspace } from '../workspace/workspace.entity';

@Entity()
export class User extends BaseEntity {
  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Task, (task) => task.user, { eager: true })
  tasks: Task[];

  @ManyToMany(() => Workspace, (workspace) => workspace.users)
  workspaces: Workspace[];
}
