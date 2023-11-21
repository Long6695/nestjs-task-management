import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../base.entity';

@Entity()
export class Auth extends BaseEntity {
  @Column()
  userId: number;

  @Column()
  isRevoked: boolean;

  @Column()
  expires: Date;
}
