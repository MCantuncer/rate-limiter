import { Request, Response, NextFunction } from 'express';
import { redisHelper } from '../helpers/redis';
import { getEndpointDetails } from '../helpers/endpoint';
import { getKeyByReqType } from '../helpers/request';
import { REDIS_REQUEST_TYPE } from '../constants/enums';

export const afterMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const epDetails = getEndpointDetails(req.originalUrl);
  const key = await getKeyByReqType(req, epDetails!.type);

  const record = await redisHelper({
    type: REDIS_REQUEST_TYPE.GET,
    key,
  });

  const data = JSON.parse(record);
  data.requestCount += epDetails!.weight;
  console.log(JSON.stringify(data));

  await redisHelper({ type: REDIS_REQUEST_TYPE.SET, key, data });
  next();
};
