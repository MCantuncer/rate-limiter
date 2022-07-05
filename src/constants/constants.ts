import { OPERATION_TYPE, REQUEST_TYPE } from './enums';

// Endpoints will be defined here with weight attribute and other important props.
export const ENDPOINT_LIST = [
  {
    url: '/public-endpoint-1',
    weight: 2,
    type: REQUEST_TYPE.PUBLIC,
    operation: OPERATION_TYPE.GET,
  },
  {
    url: '/public-endpoint-2',
    weight: 5,
    type: REQUEST_TYPE.PUBLIC,
    operation: OPERATION_TYPE.GET,
  },
  {
    url: '/public-endpoint-3',
    weight: 1,
    type: REQUEST_TYPE.PUBLIC,
    operation: OPERATION_TYPE.GET,
  },
  {
    url: '/private-endpoint-2',
    weight: 1,
    type: REQUEST_TYPE.PRIVATE,
    operation: OPERATION_TYPE.GET,
  },
  {
    url: '/private-endpoint-1',
    weight: 2,
    type: REQUEST_TYPE.PRIVATE,
    operation: OPERATION_TYPE.GET,
  },
];
