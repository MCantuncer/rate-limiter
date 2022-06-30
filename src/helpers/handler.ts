import { NextFunction, Request, Response } from 'express';
import { getReqLimitations } from './request';
import moment from 'moment';
import { IDebugData } from '../constants/interfaces';
import { RESPONSE_STATUS } from '../constants/enums';
import { getEndpointDetails } from './endpoint';
import { unixToDate } from '../utils/date-util';

// This handler will handle the request and will store response data inside request.
export const basicHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const epDetails = req.endpointDetails || getEndpointDetails(req);

  req.responseData = {
    message: `Endpoint type: ${epDetails.type}, weight: ${epDetails.weight}`,
  };

  return next();
};

// This handler will be in charge of serving response with update regarding NODE_ENV.
export const finalResponseHandler = async (req: Request, res: Response) => {
  const reqLimits = req.requestLimitations || getReqLimitations(req);
  const response = req.responseData;

  if (process.env.NODE_ENV === 'development') {
    const redisData = req.redisData;

    response.debug = {
      startingTime: unixToDate(redisData.startingTimeStamp),
      requestCount: redisData.requestCount,
      remaining: reqLimits.maxReqCount - redisData.requestCount,
    } as IDebugData;
  }

  return res.status(RESPONSE_STATUS.SUCCESS).json(response);
};
