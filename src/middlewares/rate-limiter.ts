import { NextFunction, Request, Response } from 'express';
import moment from 'moment';
import { redisHelper } from '../helpers/redis';
import { getKeyByReqType, getReqLimitations } from '../helpers/request';
import { IRedisData } from '../constants/interfaces';
import { REDIS_REQUEST_TYPE, RESPONSE_STATUS } from '../constants/enums';

export const redisRateLimiter = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { maxReqCount, perXMinutes, reqType, reqWeight } =
    req.requestLimitations || getReqLimitations(req);
  const key = await getKeyByReqType(req, reqType);

  try {
    const redisRecord = await redisHelper({
      type: REDIS_REQUEST_TYPE.GET,
      key,
    });

    const currentReqTime = moment();

    if (!redisRecord) {
      await initOnRedis(currentReqTime, key);
      return next();
    }

    const redisData = JSON.parse(redisRecord) as IRedisData;
    const xMinutesBefore = moment().subtract(perXMinutes, 'minutes').unix();
    const currentReqCount = redisData.requestCount;

    if (xMinutesBefore > redisData.startingTimeStamp) {
      await initOnRedis(currentReqTime, key);
      return next();
    }

    if (currentReqCount + reqWeight > maxReqCount) {
      return res.status(RESPONSE_STATUS.TOO_MANY_REQUESTS).json({
        message: `Request has exceeded the ${maxReqCount} requests in ${perXMinutes} minute(s)!`,
      });
    }

    return next();
  } catch (error) {
    next(error);
  }
};

export const initOnRedis = async (requestTime: moment.Moment, key: string) => {
  const data = {
    startingTimeStamp: requestTime.unix(),
    requestCount: 0, // will be updated after the endpoint has worked properly.
  } as IRedisData;

  await redisHelper({
    type: REDIS_REQUEST_TYPE.SET,
    key,
    data,
  });
};
