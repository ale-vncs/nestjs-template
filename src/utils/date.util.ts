import { format, isValid, parse } from 'date-fns';

export const isValidDate = (value: unknown) => {
  const parsedDate = parse(String(value), 'P', new Date());
  return isValid(parsedDate) ? parsedDate : null;
};

export const formatOnlyDate = (date: Date | number) => {
  return format(date, 'dd/MM/yyyy');
};
export const formatDateTime = (date: Date | number) => {
  return format(date, 'dd/MM/yyyy - HH:mm');
};
