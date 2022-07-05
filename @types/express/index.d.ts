import {
  IEndpointDetail,
  IRedisData,
  IRequestLimitations,
  IResponse,
} from '../../src/constants/interfaces';

declare global {
  namespace Express {
    export interface Request {
      redisData: IRedisData;
      endpointDetails: IEndpointDetail;
      responseData: IResponse;
      requestLimitations: IRequestLimitations;
    }
  }
}
