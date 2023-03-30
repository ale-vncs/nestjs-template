import { ResponseApi } from '@utils/result.util'
import { HttpStatus } from '@nestjs/common'
import { messagesUtil } from '@utils/messages.util'

export const parseResponse = (res: ResponseApi<unknown>) => {
  return {
    status: `${res.status} - ${HttpStatus[res.status]}`,
    code: res.code,
    msg: messagesUtil[res.code],
    body: res.data
  }
}
