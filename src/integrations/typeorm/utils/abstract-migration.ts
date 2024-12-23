import { MigrationInterface, QueryRunner } from 'typeorm';
import { runSql } from './run-sql';

export class AbstractMigration implements MigrationInterface {
  protected readonly filename: string;

  constructor(clazz: new () => unknown) {
    const className = clazz.name;
    const timestamp = className.replace(/\D/g, '');
    const migrationClassName = className.replace(/\d/g, '');
    const migrationName = migrationClassName
      .split(/(?=[A-Z])/)
      .map(this.toLoweCase)
      .join('-');
    this.filename = `${timestamp}-${migrationName}`;
  }

  async up(queryRunner: QueryRunner): Promise<void> {
    await runSql(queryRunner, 'migrations', `${this.filename}.sql`);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    //await runSql(queryRunner, `${this.filename}-down.sql`)
  }

  private toLoweCase(value: string) {
    return value.toLowerCase();
  }
}
