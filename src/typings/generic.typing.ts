export type Undefined<T> = T | undefined;
export type Null<T> = T | null;
export type NullOrUndefined<T> = T | null | undefined;
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export type ClassType<C, P = any> = new (...args: P[]) => C;
export type AbstractClassType<C> = abstract new (...args: unknown[]) => C;
export type MultiClassType<C> = ClassType<C> | AbstractClassType<C>;

export interface ResultApi<T> {
  code: string;
  msg: string;
  body: T;
}

export interface ResultError {
  code: string;
  msg: string;
  details?: unknown;
}

export type Enum<T> = {
  [k in keyof T]: T[k];
};

export type ParseEnum<E extends string> = Record<E, string>;
