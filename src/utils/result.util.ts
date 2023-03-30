import { MessagesUtilKeys } from './messages.util'
import { HttpStatus } from '@nestjs/common'
import { Undefined } from '@typings/generic.typing'

export class ResponseApi<T> {
  status = HttpStatus.OK
  code: MessagesUtilKeys = 'requestDone'
  data: Undefined<T> = undefined

  ok(code: MessagesUtilKeys = 'requestDone') {
    this.status = HttpStatus.OK
    this.code = code
    return this
  }

  setStatus(status: HttpStatus) {
    this.status = status
    return this
  }

  setCode(code: MessagesUtilKeys) {
    this.code = code
    return this
  }

  body(data: T) {
    this.data = data
    return this
  }

  static builder() {
    return new ResponseApi()
  }
}
