import { ConstraintsErrosData, MessageModel } from '@typings/message.typings';

export const messagesUtil = {
  ROUTE_NOT_FOUND: 'Rota não encontrada',
  CONTEXT_DATA_UNDEFINED: 'Data no contexto não encontrado',
  BAD_REQUEST: 'Erro no requisição.',
  CORS_NOT_ALLOWED: 'Origem não permitidas pelos CORS.',
  DATABASE_CONNECTION_ERROR: 'Erro na conexão com o banco',
  UNKNOWN_ERROR: 'Um erro desconhecido ocorreu',
  REQUEST_DONE: 'Requisição concluída.',
  METHOD_NOT_FOUND: 'Método não encontrado.',
  VALIDATION_ERROR: 'Error na validação',
  ENTITY_NOT_FOUND: 'Nenhum dado encontrado',
  NOT_AUTHORIZED: 'Não autorizado',
  ROLE_NOT_FOUND: 'Cargo não encontrado',
  LOGIN_ERROR: 'Error ao fazer login',
  // user
  WEAK_PASSWORD: 'Senha fraca',
  PASSWORD_OR_EMAIL_WRONG: 'Senha ou email inválido',
  USER_HAS_NO_PROPERTY_GROUP: 'Usuário não pertence ao grupo de propriedade',
  USER_IS_NOT_A_SALES_PERSON: 'Usuário não é vendedor',
  USER_IS_NOT_A_PROPERTY_OWNER: 'Usuário não é proprietário',
  USER_TOKEN_INVALID: 'Token do usuário inválido',
  USER_ALREADY_EXIST: 'Usuário já existe',
  USER_WITH_PENDING_ISSUES: 'Usuário com pendências',
  // devices
  DEVICE_ID_NOT_INFORMED: 'Dispositivo não informado',
  DEVICE_NOT_ACTIVE: 'O dispositivo ainda não está ativo',
  // Offer
  OFFER_NOT_ACTIVE: 'Oferta não ativa',
  OFFER_NOT_HAVE_A_PROPERTY_GROUP: 'Oferta não possui um dono de propriedade',
  OFFER_NOT_HAVE_A_SALES_PERSON: 'Oferta não possui um vendedor',
  OFFER_TYPE_IS_WRONG: 'Tipo de oferta é inválido',
  OFFER_CHANGE_STATUS_IS_NOT_ALLOWED:
    'Mudança de status da oferta não permitida',
  // User Profile
  PREFERENCE_INVALID_TO_ROLE: 'Preferência Inválida para os cargos do usuário',
  // chat
  CHAT_ALREADY_EXIST: 'Chat já existe com o número informado',
} satisfies MessageModel;

export const constraintsErrors: ConstraintsErrosData = {
  isString: {
    message: 'deve ser uma palavra',
  },
  isEmail: {
    message: 'deve ser um email',
  },
  isLength: {
    message: 'deve ser maior ou igual {0} caracteres',
    regexFilterParam: '.* must be .* than or equal to (.*) characters',
  },
  isNotEmpty: {
    message: 'não deve ser vazio',
  },
  isEnum: {
    message: 'deve ser um dos seguintes valores: {0}',
    regexFilterParam: '.* must be one of the following values: (.*)',
  },
  isInt: {
    message: 'deve ser um número inteiro',
  },
  isBoolean: {
    message: 'deve ser um boleano',
  },
  isDate: {
    message: 'deve ser uma data',
  },
  isCpf: {
    message: 'deve ser um cpf',
  },
  isDefined: {
    message: 'não deve nulo ou indefinido',
  },
  isCpfCnpj: {
    message: 'deve ser um cpf ou cnpj válido',
  },
};

export type ConstraintsKeys = keyof typeof constraintsErrors;
export type MessagesUtilKeys = keyof typeof messagesUtil;
