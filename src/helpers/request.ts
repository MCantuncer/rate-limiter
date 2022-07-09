import { Request } from 'express';
import { getEndpointDetails, getKeyForPrivateEndpoint } from './endpoint';
import { numberParseEnvData } from '../utils/data-util';
import { REQUEST_TYPE } from '../constants/enums';

export const getReqLimitations = (req: Request) => {
  const epDetails = getEndpointDetails(req.originalUrl);

  const maxReqCount =
    epDetails!.type === REQUEST_TYPE.PUBLIC
      ? numberParseEnvData(process.env.MAX_PUBLIC_REQUEST_COUNT)
      : numberParseEnvData(process.env.MAX_PRIVATE_REQUEST_COUNT);

  return {
    maxReqCount,
    perXHours: numberParseEnvData(process.env.PER_X_HOURS),
    reqType: epDetails!.type,
    reqWeight: epDetails!.weight,
  };
};

export const getKeyByReqType = async (req: Request, reqType: REQUEST_TYPE) => {
  if (reqType === REQUEST_TYPE.PUBLIC) return req.ip;

  return await getKeyForPrivateEndpoint(req);
};
