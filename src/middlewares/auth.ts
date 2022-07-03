import { NextFunction, Request, Response } from 'express';
import { getEndpointDetails } from '../helpers/endpoint';
import { REQUEST_TYPE, RESPONSE_STATUS, TOKEN_TYPE } from '../constants/enums';
import * as EmailValidator from 'email-validator';

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const epDetails = req.endpointDetails || getEndpointDetails(req);

  if (epDetails!.type === REQUEST_TYPE.PUBLIC) return next();

  if (process.env.TOKEN_TYPE == TOKEN_TYPE.EMAIL) {
    const email = req.headers['email'];
    return EmailValidator.validate((email || '') as string)
      ? next()
      : res.status(RESPONSE_STATUS.UNAUTHORIZED).json({
          message: `You should specify valid email on headers if TOKEN_TYPE is email on env variables`,
        });
  }

  return req.headers['private-api-key'] === process.env.PRIVATE_API_KEY
    ? next()
    : res.status(RESPONSE_STATUS.UNAUTHORIZED).json({
        message: `Request header should contain valid 'private-api-key' to execute this private endpoint`,
      });
};
