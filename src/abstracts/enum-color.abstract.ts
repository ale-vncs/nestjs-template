import { EnumAbstract } from '@abstracts/enum.abstract';

export interface EnumColorResponse {
  name: string;
  description: string;
  color: string;
}

export abstract class EnumColorAbstract<T> extends EnumAbstract<T> {
  constructor(
    description: string,
    private _color: string,
  ) {
    super(description);
  }

  get color() {
    return this._color;
  }

  static override toDto(e: EnumColorAbstract<unknown>): EnumColorResponse {
    return {
      name: e.enumName,
      description: e.description,
      color: e.color,
    };
  }
}
