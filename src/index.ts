import express, { Express } from 'express';
import dotenv from 'dotenv';
import { redisRateLimiter } from './middlewares/rate-limiter';
import { exposeEndpoints } from './helpers/endpoint';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use(redisRateLimiter);

exposeEndpoints(app);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
