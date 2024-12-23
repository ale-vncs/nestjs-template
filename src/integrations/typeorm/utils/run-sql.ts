import * as fs from 'node:fs';
import * as path from 'node:path';
import { QueryRunner } from 'typeorm';

type PathSql = 'migrations' | 'seed';

export const runSql = async (
  queryRunner: QueryRunner,
  pathSql: PathSql,
  sqlname: string,
) => {
  const file = fs.readFileSync(
    path.join(process.cwd(), 'db', pathSql, sqlname),
    {
      encoding: 'utf-8',
    },
  );

  await queryRunner.query(file);
};
