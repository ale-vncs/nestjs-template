import * as fs from 'node:fs';
import * as path from 'node:path';
import { input, select } from '@inquirer/prompts';
import { format } from 'date-fns';
import { AbstractGenerator, GeneratorOptions } from '../abstract-generator';

export class Generator extends AbstractGenerator {
  private readonly CHAR_SEPARATOR = '-';

  options(): GeneratorOptions {
    return {
      title: 'Criar Migração do Banco de Dados',
      name: 'DB_MIGRATION_SEED',
    };
  }

  async generate() {
    const type = await select({
      message: 'Qual o tipo de migração desejado?',
      choices: [
        {
          value: 'migrations',
          name: 'Migração',
        },
        {
          value: 'seed',
          name: 'Semear',
        },
      ],
    });
    const answer = await input({
      message: 'Qual irá ser o nome do arquivo?',
      required: true,
      validate: (input: string) => {
        const pass = !!input;
        if (pass) return true;
        return 'Informe o nome do arquivo';
      },
    });
    this.createMigrationFiles(
      type,
      this.replaceSpecialChar(answer, this.CHAR_SEPARATOR),
    );
  }

  private createMigrationFiles(type: string, migrationName: string) {
    const migrationNameParsed = this.replaceSpecialChar(migrationName);
    console.log(`Gerando ${migrationNameParsed}...`);
    const migrationTsFilePath = path.join(
      this.getBackendRootPath(),
      `src/integrations/typeorm/${type}`,
    );
    const migrationSqlFilePath = path.join(
      this.getBackendRootPath(),
      `db/${type}`,
    );

    const currentTime = format(new Date().toISOString(), 'yyyyMMddHHmmss');
    const filename = [currentTime, migrationNameParsed].join(
      this.CHAR_SEPARATOR,
    );
    const sqlFilename = `${filename}.sql`;
    const migrationFilename = `${filename}.ts`;
    const className = migrationNameParsed
      .split(this.CHAR_SEPARATOR)
      .map((c) => {
        return `${c[0].toUpperCase()}${c.substring(1)}`;
      })
      .join('')
      .concat(currentTime);

    let migrationTsFile = fs.readFileSync(
      path.join(__dirname, `${type}-ts-template.txt`),
      { encoding: 'utf-8' },
    );
    migrationTsFile = migrationTsFile.replace(/{{FileName}}/g, className);

    fs.writeFileSync(
      path.join(migrationTsFilePath, migrationFilename),
      migrationTsFile,
    );
    fs.writeFileSync(
      path.join(migrationSqlFilePath, sqlFilename),
      '-- create your sql here\n',
    );

    console.log(
      `Arquivo ${migrationNameParsed} de migração gerado com sucesso`,
    );
  }
}
