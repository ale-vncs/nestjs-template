import { HttpStatus } from '@nestjs/common';
import { Undefined } from '@typings/generic.typing';
import { MessagesUtilKeys } from './messages.util';

export class ResponseApi<T> {
  _status = HttpStatus.OK;
  _code: MessagesUtilKeys = 'REQUEST_DONE';
  _body: Undefined<T> = undefined;
  _error: Undefined<unknown> = undefined;

  ok(code: MessagesUtilKeys = 'REQUEST_DONE') {
    this._status = HttpStatus.OK;
    this._code = code;
    return this;
  }

  status(status: HttpStatus) {
    this._status = status;
    return this;
  }

  code(code: MessagesUtilKeys) {
    this._code = code;
    return this;
  }

  body(data: T) {
    this._body = data;
    return this;
  }

  error(error: unknown) {
    this._error = error;
    return this;
  }

  static builder() {
    return new ResponseApi();
  }

  static ok(code: MessagesUtilKeys = 'REQUEST_DONE') {
    return ResponseApi.builder().ok(code);
  }
}
