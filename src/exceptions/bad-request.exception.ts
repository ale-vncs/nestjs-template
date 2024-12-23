import { ApiErrorException } from '@exceptions/api-error.exception';
import { MessagesUtilKeys } from '@utils/messages.util';

export class BadRequestException extends ApiErrorException {
  constructor(descriptionCode: MessagesUtilKeys) {
    super('BAD_REQUEST', descriptionCode);
  }
}
