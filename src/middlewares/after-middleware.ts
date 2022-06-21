import { Request, Response, NextFunction } from 'express';
import { redisHelper } from '../helpers/redis';
import { getEndpointDetails } from '../helpers/endpoint';
import { getKeyByReqType } from '../helpers/request';
import { REDIS_REQUEST_TYPE } from '../constants/enums';

// This middleware will update requestCount on redis if basicHandler works properly with success.
export const afterMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const epDetails = req.reqData?.endpointDetails || getEndpointDetails(req);
  const key = await getKeyByReqType(req, epDetails.type);

  const record = await redisHelper({
    type: REDIS_REQUEST_TYPE.GET,
    key,
  });

  const data = JSON.parse(record);
  data.requestCount += epDetails.weight;
  console.log(JSON.stringify(data));

  await redisHelper({ type: REDIS_REQUEST_TYPE.SET, key, data });

  req.reqData.redisData = data;
  next();
};
