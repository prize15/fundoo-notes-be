import { createClient } from 'redis';
import Logger from './logger';

const redisClient = createClient();

redisClient.on('error', (err) => {
  Logger.logger.error(`Redis Client Error: ${err}`);
});

redisClient.connect()
  .then(() => {
    Logger.logger.info('Connected to Redis');
  })
  .catch((error) => {
    Logger.logger.error('Redis connection error:', error);
  });

export default redisClient;
