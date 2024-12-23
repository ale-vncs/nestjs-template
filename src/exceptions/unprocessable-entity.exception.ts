import { ApiErrorException } from '@exceptions/api-error.exception';
import { MessagesUtilKeys } from '@utils/messages.util';

export class UnprocessableEntityException extends ApiErrorException {
  constructor(descriptionCode: MessagesUtilKeys, details?: string) {
    super('UNPROCESSABLE_ENTITY', descriptionCode, details);
  }
}
