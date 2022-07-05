import { OPERATION_TYPE, REQUEST_TYPE } from './enums';
import { numberParseEnvData } from '../utils/data-util';

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

export interface IDebugData {
  startingTime: string;
  requestCount: number;
  remaining: number;
}

export interface IResponse {
  message: string;
  debug?: IDebugData;
}

export interface IRequestLimitations {
  maxReqCount: number;
  perXMinutes: number;
  reqType: REQUEST_TYPE;
  reqWeight: number;
}
