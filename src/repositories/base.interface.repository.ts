import {
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
} from 'typeorm';
import { UpdateResult } from 'typeorm/query-builder/result/UpdateResult';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { QueryRunner } from 'typeorm/query-runner/QueryRunner';
import { SelectQueryBuilder } from 'typeorm/query-builder/SelectQueryBuilder';

export interface BaseInterfaceRepository<T> {
  create(data: DeepPartial<T>): T;

  save(data: DeepPartial<T>): Promise<T>;

  saveMany(data: DeepPartial<T[]>): Promise<T[]>;

  update(
    filterOptions: FindOptionsWhere<T>,
    data: QueryDeepPartialEntity<T>,
  ): Promise<UpdateResult>;

  delete(id: number): any;

  findOneById(id: number): Promise<T>;

  findAll(filterCondition?: FindManyOptions): Promise<T[]>;

  findOneByCondition(filterCondition: FindOneOptions): Promise<T>;

  findWithRelations(relations: FindManyOptions): Promise<T[]>;

  createQueryBuilder(
    alias?: string,
    queryRunner?: QueryRunner,
  ): SelectQueryBuilder<T>;

  findAndCount(options?: FindManyOptions<T>): Promise<[T[], number]>;
}
