import { BaseInterfaceRepository } from './base.interface.repository';
import {
  DeepPartial,
  DeleteResult,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { UpdateResult } from 'typeorm/query-builder/result/UpdateResult';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { QueryRunner } from 'typeorm/query-runner/QueryRunner';
import { SelectQueryBuilder } from 'typeorm/query-builder/SelectQueryBuilder';

export abstract class BaseAbstractRepository<T extends { id: number }>
  implements BaseInterfaceRepository<T>
{
  private entity: Repository<T>;
  protected constructor(entity: Repository<T>) {
    this.entity = entity;
  }

  public save(data: DeepPartial<T>): Promise<T> {
    return this.entity.save(data);
  }

  public saveMany(data: DeepPartial<T[]>): Promise<T[]> {
    return this.entity.save(data);
  }

  public create(data: DeepPartial<T>): T {
    return this.entity.create(data);
  }

  public update(
    filterOptions: FindOptionsWhere<T>,
    data: QueryDeepPartialEntity<T>,
  ): Promise<UpdateResult> {
    return this.entity.update(filterOptions, data);
  }

  public delete(id: number): Promise<DeleteResult> {
    return this.entity.delete(id);
  }

  public findOneById(id: number): Promise<T> {
    const options: FindOptionsWhere<T> = { id } as FindOptionsWhere<T>;
    return this.entity.findOneBy(options);
  }
  public findOneByCondition(filterCondition: FindOneOptions): Promise<T> {
    return this.entity.findOne(filterCondition);
  }

  public findWithRelations(relations: FindManyOptions): Promise<T[]> {
    return this.entity.find(relations);
  }

  public findAll(filterCondition?: FindManyOptions): Promise<T[]> {
    return this.entity.find(filterCondition);
  }

  public createQueryBuilder(
    alias?: string,
    queryRunner?: QueryRunner,
  ): SelectQueryBuilder<T> {
    return this.entity.createQueryBuilder(alias, queryRunner);
  }

  public findAndCount(options?: FindManyOptions<T>): Promise<[T[], number]> {
    return this.entity.findAndCount(options);
  }
}
