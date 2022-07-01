import { Express, NextFunction, Request, Response } from 'express';
import { afterMiddleware } from '../middlewares/after-middleware';
import { redisHelper } from './redis';
import { v4 as uuidv4 } from 'uuid';
import {
  OPERATION_TYPE,
  REDIS_REQUEST_TYPE,
  REQUEST_TYPE,
  RESPONSE_STATUS,
  TOKEN_TYPE,
} from '../constants/enums';
import { ENDPOINT_LIST } from '../constants/constants';
import { IDebugData, IEndpointDetail } from '../constants/interfaces';
import moment from 'moment';
import { getReqLimitations } from './request';

export const getEndpointDetails = (req: Request): IEndpointDetail => {
  const details = ENDPOINT_LIST.find(
    (item: IEndpointDetail) => item.url === req.originalUrl
  );

  req.endpointDetails = details!;
  return details!;
};

// This handler will handle the request and will store response data inside request.
const basicHandler = (req: Request, res: Response, next: NextFunction) => {
  const epDetails = req.endpointDetails || getEndpointDetails(req);

  req.responseData = {
    message: `Endpoint type: ${epDetails.type}, weight: ${epDetails.weight}`,
  };

  next();
};

// This handler will be in charge of serving response with update regarding NODE_ENV.
const finalResponseHandler = async (req: Request, res: Response) => {
  const reqLimits = req.requestLimitations || getReqLimitations(req);
  const response = req.responseData;

  if (process.env.NODE_ENV === 'development') {
    const redisData = req.redisData;

    response.debug = {
      startingTime: moment
        .unix(redisData.startingTimeStamp)
        .format('DD/MM/YYYY HH:mm'),
      requestCount: redisData.requestCount,
      remaining: reqLimits.maxReqCount - redisData.requestCount,
    } as IDebugData;
  }

  return res.status(RESPONSE_STATUS.SUCCESS).json(response);
};

export const getKeyForPrivateEndpoint = async (
  req: Request
): Promise<string> => {
  if (process.env.TOKEN_TYPE === TOKEN_TYPE.PRIVATE_API_KEY)
    return req.headers['private-api-key'] as string;

  const email = req.headers['email'] as string;

  const token = await redisHelper({
    type: REDIS_REQUEST_TYPE.GET,
    key: email,
  });

  const privateKey = uuidv4();

  if (!token) {
    await redisHelper({
      type: REDIS_REQUEST_TYPE.SET,
      key: email,
      data: `${privateKey}`,
    });

    return privateKey;
  }

  return token;
};

// This method will create endpoints which are initialized on ENDPOINT_LIST constants.
export const exposeEndpoints = (app: Express): void => {
  ENDPOINT_LIST.forEach((endpointDetail: IEndpointDetail) => {
    switch (endpointDetail.operation) {
      case OPERATION_TYPE.GET:
        if (endpointDetail.type === REQUEST_TYPE.PRIVATE) {
          app.get(
            `${endpointDetail.url}`,
            basicHandler,
            afterMiddleware,
            finalResponseHandler
          );
          break;
        }
        app.get(
          `${endpointDetail.url}`,
          basicHandler,
          afterMiddleware,
          finalResponseHandler
        );
        break;
      case OPERATION_TYPE.POST:
        if (endpointDetail.type === REQUEST_TYPE.PRIVATE) {
          app.post(
            `${endpointDetail.url}`,
            basicHandler,
            afterMiddleware,
            finalResponseHandler
          );
          break;
        }

        app.post(
          `${endpointDetail.url}`,
          basicHandler,
          afterMiddleware,
          finalResponseHandler
        );
        break;
    }
  });
};
