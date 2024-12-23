import { OrderByParams } from '@abstracts/pagination-query.abstract';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { Null } from '@typings/generic.typing';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';
import { ObjectLiteral } from 'typeorm/common/ObjectLiteral';

export interface Pagination<T = unknown> {
  data: T[];
  page: number;
  size: number;
  total: number;
  isLastPage: boolean;
}

interface PaginationUtilProps<T extends ObjectLiteral> {
  repository: Repository<T>;
  alias: string;
  disabledSortCreatedAt?: boolean;
}

interface PaginationParse<T extends ObjectLiteral, R = T> {
  qb: SelectQueryBuilder<T>;
  page: number;
  size: number;
  parse?: (d: T) => R | Promise<R>;
}

class QueryFn<T extends ObjectLiteral> {
  protected readonly alias: string;
  readonly queryBuilder: SelectQueryBuilder<T>;

  constructor(queryBuilder: SelectQueryBuilder<T>, alias: string) {
    this.alias = alias;
    this.queryBuilder = queryBuilder as SelectQueryBuilder<T>;
  }

  private getField<K extends keyof T>(field: K) {
    return {
      qField: `${this.alias}.${field as string}`,
      qParam: randomStringGenerator().substring(6),
    };
  }

  leftJoinAndSelect<K extends keyof T>(field: K) {
    this.queryBuilder.leftJoinAndSelect(
      this.getField(field).qField,
      field as string,
    );
    return new QueryFn<T[K]>(
      this.queryBuilder as SelectQueryBuilder<T[K]>,
      field as string,
    );
  }

  leftJoin<K extends keyof T | string>(field: K) {
    this.queryBuilder.leftJoin(this.getField(field).qField, field as string);
    return new QueryFn(this.queryBuilder, field as string);
  }

  andLike<K extends keyof T>(field: K, value: string) {
    const { qParam, qField } = this.getField(field);
    this.queryBuilder.andWhere(`LOWER(${qField}) like LOWER(:${qParam})`, {
      [qParam]: value,
    });
  }

  and<K extends keyof T>(field: K, value: string | number) {
    const { qField, qParam } = this.getField(field);
    this.queryBuilder.andWhere(`${qField} = :${qParam}`, {
      [qParam]: value,
    });
  }

  andIn<K extends keyof T>(field: K, values: (string | number)[]) {
    const { qField, qParam } = this.getField(field);
    this.queryBuilder.andWhere(`${qField} in (:...${qParam})`, {
      [qParam]: values,
    });
  }

  andBoolean<K extends keyof T>(field: K, value: boolean) {
    const { qField, qParam } = this.getField(field);
    this.queryBuilder.andWhere(`${qField} = :${qParam}`, {
      [qParam]: value ? '1' : '0',
    });
  }

  andIsNotNull<K extends keyof T>(field: K) {
    this.queryBuilder.andWhere(`${this.getField(field).qField} is not null`);
  }

  andIsNull<K extends keyof T>(field: K) {
    this.queryBuilder.andWhere(`${this.getField(field).qField} is null`);
  }

  andMoreOrEqualThan<K extends keyof T>(
    field: K,
    value: string | number | Date,
  ) {
    const { qField, qParam } = this.getField(field);
    this.queryBuilder.andWhere(`${qField} >= :${qParam}`, { [qParam]: value });
  }

  andLessOrEqualThan<K extends keyof T>(
    field: K,
    value: string | number | Date,
  ) {
    const { qField, qParam } = this.getField(field);
    this.queryBuilder.andWhere(`${qField} <= :${qParam}`, { [qParam]: value });
  }

  andMoreThan<K extends keyof T>(field: K, value: string | number | Date) {
    const { qField, qParam } = this.getField(field);
    this.queryBuilder.andWhere(`${qField} > :${qParam}`, { [qParam]: value });
  }

  andLessThan<K extends keyof T>(field: K, value: string | number | Date) {
    const { qField, qParam } = this.getField(field);
    this.queryBuilder.andWhere(`${qField} < :${qParam}`, { [qParam]: value });
  }

  andBracket() {
    this.queryBuilder.andWhere(new Brackets((qb) => {}));
  }
}

export class PaginationUtil<T extends ObjectLiteral> extends QueryFn<T> {
  private readonly disabledSortCreatedAt: boolean = false;
  private _page = 1;
  private _size = 20;
  private sortField: Null<string> = null;
  private sortDirection: 'asc' | 'desc' = 'asc';

  constructor({
    repository,
    alias,
    disabledSortCreatedAt,
  }: PaginationUtilProps<T>) {
    super(repository.createQueryBuilder(alias), alias);
    this.disabledSortCreatedAt = disabledSortCreatedAt ?? false;
  }

  page(page: number) {
    this._page = page;
    return this;
  }

  size(size: number) {
    this._size = size;
    return this;
  }

  sort(field: string, direction: 'asc' | 'desc') {
    this.sortField = field;
    this.sortDirection = direction;
    return this;
  }

  async result<R = T>(parse?: (data: T) => R): Promise<Pagination<R>> {
    const skip = this._size * (this._page - 1);

    if (this._size > -1) {
      this.queryBuilder.skip(skip).take(this._size);
    }

    if (this.sortField) {
      const field = this.sortField.includes('.')
        ? this.sortField
        : `${this.alias}.${this.sortField}`;
      this.queryBuilder.orderBy(
        field,
        this.sortDirection === 'asc' ? 'ASC' : 'DESC',
      );
    } else if (!this.disabledSortCreatedAt) {
      this.queryBuilder.orderBy(`${this.alias}.createdAt`, 'DESC');
    }

    return PaginationUtil.parse<T, R>({
      qb: this.queryBuilder,
      size: this._size,
      page: this._page,
      parse,
    });
  }

  static async parse<T extends ObjectLiteral, R = T>(
    op: PaginationParse<T, R>,
  ): Promise<Pagination<R>> {
    const [data, count] = await op.qb.getManyAndCount();

    const skip = op.size * (op.page - 1);
    const isLastPage = op.size < 0 ? true : skip + op.size >= count;

    return {
      page: op.page,
      size: op.size,
      data: await Promise.all(
        data.map((d) => (op.parse ? op.parse(d) : d)) as R[],
      ),
      total: count,
      isLastPage,
    };
  }

  static sort<T extends ObjectLiteral>(
    qb: SelectQueryBuilder<T>,
    sort: OrderByParams,
  ) {
    const { field, direction } = sort;
    const orderDirection = direction.getName() === 'asc' ? 'ASC' : 'DESC';

    const orderField = field.includes('.') ? field : `${qb.alias}.${field}`;

    qb.orderBy(orderField, orderDirection);
  }
}
