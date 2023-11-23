import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { User } from '../users/user.entity';
import { Task } from '../tasks/task.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class Workspace extends BaseEntity {
  @Column()
  name: string;

  @Column()
  description: string;

  @ManyToMany(() => User, (user) => user.workspaces)
  @JoinTable()
  @Exclude({ toPlainOnly: true })
  users: User[];

  @OneToMany(() => Task, (task) => task.workspace, { eager: true })
  tasks: Task[];
}
