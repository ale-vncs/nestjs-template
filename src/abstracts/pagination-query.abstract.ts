import { IsClassEx, IsNumberEx, IsTsEnumEx } from '@decorators/validators';
import { SortDirectionEnum } from '@enums/sort-direction.enum';
import { IsOptional, IsString } from 'class-validator';
import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';

export class OrderByParams {
  @IsString()
  field!: string;

  @IsTsEnumEx(SortDirectionEnum)
  direction: SortDirectionEnum = SortDirectionEnum.ASC;
}

export abstract class PaginationQueryAbstract {
  @IsNumberEx()
  page = 1;

  @IsNumberEx()
  size = 20;

  @IsOptional()
  @IsClassEx(OrderByParams)
  sort?: OrderByParams;

  addPagination(queryBuilder: SelectQueryBuilder<ObjectLiteral>) {
    const skip = (this.page - 1) * this.size;
    queryBuilder.take(this.size).skip(skip);
  }
}
