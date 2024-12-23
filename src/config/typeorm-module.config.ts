import { dataSourceOptions } from '@integrations/typeorm/typeorm-datasource.config';
import { DynamicModule, Injectable } from '@nestjs/common';
import {
  TypeOrmModule,
  TypeOrmModuleOptions,
  TypeOrmOptionsFactory,
} from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { addTransactionalDataSource } from 'typeorm-transactional';

export const typeOrmModuleOptions = (
  dataSource: DataSourceOptions,
): TypeOrmModuleOptions => {
  return {
    ...dataSource,
    retryAttempts: 3,
    autoLoadEntities: true,
    namingStrategy: new SnakeNamingStrategy(),
  };
};

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  createTypeOrmOptions(): TypeOrmModuleOptions {
    const dataSource = dataSourceOptions();
    return typeOrmModuleOptions(dataSource);
  }
}

export const typeormModuleConfig: DynamicModule = TypeOrmModule.forRootAsync({
  useClass: TypeOrmConfigService,
  dataSourceFactory: async (options) => {
    if (!options) {
      throw new Error('Error options dataSourceFactory');
    }
    return addTransactionalDataSource(new DataSource(options));
  },
});
