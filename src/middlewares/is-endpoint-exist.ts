import { NextFunction, Request, Response } from 'express';
import { getEndpointDetails } from '../helpers/endpoint';
import { RESPONSE_STATUS } from '../constants/enums';
import { IRequestData } from '../constants/interfaces';

export const isEndpointExistMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  req.reqData = {} as IRequestData;
  const epDetails = getEndpointDetails(req);

  if (!epDetails)
    return res
      .status(RESPONSE_STATUS.NOT_FOUND)
      .json({ message: 'Requested endpoint does not belong to this API' });

  return next();
};
