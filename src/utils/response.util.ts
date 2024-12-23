import { ResultApi, ResultError } from '@typings/generic.typing';
import { messagesUtil } from '@utils/messages.util';
import { ResponseApi } from '@utils/result.util';

export const parseResponse = (
  res: ResponseApi<unknown>,
): ResultApi<unknown> => {
  return {
    code: res._code,
    msg: messagesUtil[res._code],
    body: res._body,
  };
};

export const parseResponseError = (res: ResponseApi<unknown>): ResultError => {
  return {
    code: res._code,
    msg: messagesUtil[res._code],
    details: res._error,
  };
};
