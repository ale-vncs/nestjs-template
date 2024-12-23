import { ApiErrorException } from '@exceptions/api-error.exception';
import { MessagesUtilKeys } from '@utils/messages.util';

export class InternalServerErrorException extends ApiErrorException {
  constructor(descriptionCode: MessagesUtilKeys) {
    super('INTERNAL_SERVER_ERROR', descriptionCode);
  }
}
