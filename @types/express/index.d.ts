import { IRequestData } from '../../src/constants/interfaces';

declare global {
  namespace Express {
    export interface Request {
      reqData: IRequestData;
    }
  }
}
