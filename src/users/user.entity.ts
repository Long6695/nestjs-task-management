import { Entity, Column, OneToMany } from 'typeorm';
import { Task } from '../tasks/task.entity';
import { BaseEntity } from '../base.entity';

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
}
