import { isValidDate } from '@utils/date.util';
import { merge } from 'lodash';

export const normalizeQuery = (query: Record<string, string>) => {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const tempQuery: Record<string, any> = {};

  const nestedKey = (key: string, value: string) => {
    const keySplit = key.split('.');
    if (keySplit.length === 1) {
      return { [key]: parseValue(value) };
    }
    const obj: Record<string, unknown> = {};
    obj[keySplit[0]] = nestedKey(keySplit.slice(1).join('.'), value);
    return obj;
  };

  Object.entries(query).forEach(([key, value]) => {
    if (key.includes('.')) {
      const obj = nestedKey(key, value);
      merge(tempQuery, obj);
    } else if (value) {
      tempQuery[key] = parseValue(value);
    }
  });

  return tempQuery;
};

const parseValue = (value: string): unknown => {
  if (/\[.*\]/.test(value)) {
    return value
      .substring(1, value.length - 1)
      .split(',')
      .filter(Boolean)
      .map(parseValue);
  }

  if (['true', 'false'].includes(value)) {
    return value === 'true';
  }

  const date = isValidDate(value);
  if (date) {
    return date;
  }

  return value;
};
