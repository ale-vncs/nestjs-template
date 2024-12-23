import { Enum, EnumType } from 'ts-jenum';

@Enum()
export class SortDirectionEnum extends EnumType<SortDirectionEnum>() {
  static DESC = new SortDirectionEnum('desc');
  static ASC = new SortDirectionEnum('asc');

  constructor(private name: string) {
    super();
  }

  getName(): string {
    return this.name;
  }
}
