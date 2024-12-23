import { AbstractException } from '@exceptions/abstract-exception';
import { HttpStatus } from '@nestjs/common';
import { MessagesUtilKeys, messagesUtil } from '@utils/messages.util';

export class ApiErrorException extends AbstractException {
  public status = HttpStatus.INTERNAL_SERVER_ERROR;
  public readonly errCode: MessagesUtilKeys;
  public readonly description: string;
  public readonly details?: string;

  constructor(
    status: keyof typeof HttpStatus,
    errCode: MessagesUtilKeys,
    details?: string,
  ) {
    super(messagesUtil[errCode]);
    this.status = HttpStatus[status];
    this.errCode = errCode;
    this.description = messagesUtil[errCode];
    this.details = details;
  }
}
