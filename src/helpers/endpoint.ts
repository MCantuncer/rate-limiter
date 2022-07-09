import { Express, NextFunction, Request, Response } from 'express';
import { authMiddleware } from '../middlewares/auth';
import { afterMiddleware } from '../middlewares/after-middleware';
import { redisHelper } from './redis';
import { uuid } from 'uuidv4';
import {
  OPERATION_TYPE,
  REDIS_REQUEST_TYPE,
  REQUEST_TYPE,
  RESPONSE_STATUS,
  TOKEN_TYPE,
} from '../constants/enums';
import { ENDPOINT_LIST } from '../constants/constants';
import { IEndpointDetail } from '../constants/interfaces';

export const getEndpointDetails = (
  originalUrl: string
): IEndpointDetail | undefined => {
  return ENDPOINT_LIST.find((item) => item.url === originalUrl);
};

const basicHandler = (req: Request, res: Response, next: NextFunction) => {
  console.log(`Request has arrived.`);
  next();
};

const finalResponseHandler = (req: Request, res: Response) => {
  const epDetails = getEndpointDetails(req.originalUrl);

  return res.status(RESPONSE_STATUS.SUCCESS).json({
    message: `Endpoint type: ${epDetails!.type}, weight: ${epDetails!.weight}`,
  });
};

export const getKeyForPrivateEndpoint = async (
  req: Request
): Promise<string> => {
  if (process.env.TOKEN_TYPE === TOKEN_TYPE.PRIVATE_API_KEY)
    return req.headers['private-api-key'] as string;

  const email = req.headers['email'] as string;

  if (!email) return '';

  const token = await redisHelper({
    type: REDIS_REQUEST_TYPE.GET,
    key: email,
  });

  const privateKey = uuid();

  if (!token) {
    await redisHelper({
      type: REDIS_REQUEST_TYPE.SET,
      key: email,
      data: `${privateKey}`,
    });
  }

  return privateKey;
};

export const exposeEndpoints = (app: Express): void => {
  ENDPOINT_LIST.forEach((endpointDetail: IEndpointDetail) => {
    switch (endpointDetail.operation) {
      case OPERATION_TYPE.GET:
        if (endpointDetail.type === REQUEST_TYPE.PRIVATE)
          app.get(
            `${endpointDetail.url}`,
            authMiddleware,
            basicHandler,
            afterMiddleware,
            finalResponseHandler
          );

        app.get(
          `${endpointDetail.url}`,
          basicHandler,
          afterMiddleware,
          finalResponseHandler
        );
        break;
      case OPERATION_TYPE.POST:
        if (endpointDetail.type === REQUEST_TYPE.PRIVATE)
          app.post(
            `${endpointDetail.url}`,
            authMiddleware,
            basicHandler,
            afterMiddleware,
            finalResponseHandler
          );

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
