import { OPERATION_TYPE, REQUEST_TYPE } from './enums';

export interface IRedisRequest {
  type: number;
  key: string;
  data?: IRedisData | string;
}

export interface IRedisData {
  startingTimeStamp: number;
  requestCount: number;
}

export interface IEndpointDetail {
  url: string;
  weight: number;
  type: REQUEST_TYPE;
  operation: OPERATION_TYPE;
}
