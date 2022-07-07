import { NextFunction, Request, Response } from 'express';
import { getEndpointDetails } from '../helpers/endpoint';
import { REQUEST_TYPE, RESPONSE_STATUS } from '../constants/enums';

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const epDetails = getEndpointDetails(req.originalUrl);

  if (epDetails!.type === REQUEST_TYPE.PUBLIC) return next();

  return req.headers['private-api-key'] === process.env.PRIVATE_API_KEY
    ? next()
    : res.status(RESPONSE_STATUS.UNAUTHORIZED).json({
        message: `Request header should contain valid 'private-api-key' to execute this private endpoint`,
      });
};
