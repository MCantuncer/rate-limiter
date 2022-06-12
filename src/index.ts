import express, { Express } from 'express';
import dotenv from 'dotenv';
import { redisRateLimiter } from './middlewares/rate-limiter';
import { exposeEndpoints } from './helpers/endpoint';
import { authMiddleware } from './middlewares/auth';
import { isEndpointExistMiddleware } from './middlewares/is-endpoint-exist';

dotenv.config();

const app: Express = express();
const port = 8000;

app.use(isEndpointExistMiddleware);
app.use(authMiddleware);
app.use(redisRateLimiter);

exposeEndpoints(app);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port} 🚀`);
});
