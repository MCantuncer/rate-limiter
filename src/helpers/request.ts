import { Request } from 'express';
import { getEndpointDetails, getKeyForPrivateEndpoint } from './endpoint';
import { numberParseEnvData } from '../utils/data-util';
import { REQUEST_TYPE } from '../constants/enums';

export const getReqLimitations = (req: Request) => {
  const epDetails = req.endpointDetails || getEndpointDetails(req);

  const maxReqCount =
    epDetails.type === REQUEST_TYPE.PUBLIC
      ? numberParseEnvData(process.env.MAX_PUBLIC_REQUEST_COUNT)
      : numberParseEnvData(process.env.MAX_PRIVATE_REQUEST_COUNT);

  const limitations = {
    maxReqCount,
    perXMinutes: numberParseEnvData(process.env.PER_X_MINUTES),
    reqType: epDetails.type,
    reqWeight: epDetails.weight,
  };

  req.requestLimitations = limitations;
  return limitations;
};

export const getKeyByReqType = async (req: Request, reqType: REQUEST_TYPE) => {
  if (reqType === REQUEST_TYPE.PUBLIC) return req.ip;

  return await getKeyForPrivateEndpoint(req);
};
