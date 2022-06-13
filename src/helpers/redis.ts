import { createClient } from 'redis';
import { IRedisRequest } from '../constants/interfaces';
import { REDIS_REQUEST_TYPE } from '../constants/enums';

export const redisHelper = async (request: IRedisRequest) => {
  const redisClient = createClient({ url: 'redis://redis:6379' });
  redisClient.on('error', (err) => console.log('Redis Client Error', err));

  await redisClient.connect();

  switch (request.type) {
    case REDIS_REQUEST_TYPE.GET:
      return await get(redisClient, request);
    case REDIS_REQUEST_TYPE.SET:
      return await set(redisClient, request);
  }
};

export const get = async (redisClient: any, request: IRedisRequest) => {
  return await redisClient.get(request.key);
};

export const set = async (redisClient: any, request: IRedisRequest) => {
  return await redisClient.set(request.key, JSON.stringify(request.data));
};
