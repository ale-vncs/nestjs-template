import { QueryRunner } from 'typeorm';
import { AbstractMigration } from './abstract-migration';
import { runSql } from './run-sql';

export class AbstractSeed extends AbstractMigration {
  override async up(queryRunner: QueryRunner): Promise<void> {
    await runSql(queryRunner, 'seed', `${this.filename}.sql`);
  }
}
