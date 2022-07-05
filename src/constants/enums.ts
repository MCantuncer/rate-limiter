export enum REDIS_REQUEST_TYPE {
  GET = 1,
  SET = 2,
}

export enum RESPONSE_STATUS {
  SUCCESS = 200,
  UNAUTHORIZED = 401,
  NOT_FOUND = 404,
  TOO_MANY_REQUESTS = 429,
}

export enum TOKEN_TYPE {
  PRIVATE_API_KEY = 'private-api-key',
  EMAIL = 'email',
}

export enum REQUEST_TYPE {
  PUBLIC = 1,
  PRIVATE = 2,
}

export enum OPERATION_TYPE {
  GET = 1,
  POST = 2,
}
