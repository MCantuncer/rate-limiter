import { Express, Request } from 'express';
import { afterMiddleware } from '../middlewares/after-middleware';
import { redisHelper } from './redis';
import { v4 as uuidv4 } from 'uuid';
import {
  OPERATION_TYPE,
  REDIS_REQUEST_TYPE,
  REQUEST_TYPE,
  TOKEN_TYPE,
} from '../constants/enums';
import { ENDPOINT_LIST } from '../constants/constants';
import { IEndpointDetail } from '../constants/interfaces';
import { basicHandler, finalResponseHandler } from './handler';

export const getEndpointDetails = (req: Request): IEndpointDetail => {
  const details = ENDPOINT_LIST.find(
    (item: IEndpointDetail) => item.url === req.originalUrl
  );

  req.reqData.endpointDetails = details!;
  return details!;
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

// This method will create endpoints which are initialized in ENDPOINT_LIST on constants.
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
