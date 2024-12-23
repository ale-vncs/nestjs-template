import { AbstractException } from '@exceptions/abstract-exception';
import { Undefined } from '@typings/generic.typing';
import { constraintsErrors } from '@utils/messages.util';
import { ValidationError } from 'class-validator';

export class ValidationErrorException extends AbstractException {
  public erros: ValidationError[];

  constructor(errors: ValidationError[]) {
    super();
    this.erros = errors;
  }

  parse() {
    const parseError: Record<string, string[]> = {};

    this.erros.forEach((err) => {
      this.buildArrayErrors(parseError, err.property, err.constraints);
      this.buildArrayChildrenErrors(parseError, err.property, err.children);
    });

    return parseError;
  }

  private buildArrayChildrenErrors(
    obj: Record<string, string[]>,
    parentProperty: string,
    children: ValidationError[] | undefined,
  ) {
    if (!children) return;
    if (!children.length) return;

    children.forEach((err) => {
      this.buildArrayErrors(
        obj,
        `${parentProperty}.${err.property}`,
        err.constraints,
      );
    });
  }

  private buildArrayErrors(
    obj: Record<string, string[]>,
    parentProperty: string,
    constraints: Undefined<Record<string, string>>,
  ) {
    if (!constraints) return;

    const errors: string[] = [];

    Object.entries(constraints).forEach(([key, value]) => {
      if (value.startsWith('*')) {
        errors.push(value.substring(1));
      } else {
        errors.push(this.parseMessageError(key, value));
      }
    });

    obj[parentProperty] = errors;
  }

  private parseMessageError(constraints: string, value: string) {
    const parseMessage = constraintsErrors[constraints];

    if (!parseMessage) {
      return value;
    }

    let message = parseMessage.message;
    const regexFilterParam = parseMessage.regexFilterParam;

    if (!regexFilterParam) return message;

    const regex = new RegExp(regexFilterParam, 'g');

    const params = regex.exec(value);
    if (params) {
      params.shift();
      params.forEach((param, index) => {
        message = message.replace(`{${index}}`, param);
      });
    }

    return message;
  }
}
