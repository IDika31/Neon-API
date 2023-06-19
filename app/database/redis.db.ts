import dotenv from 'dotenv';
dotenv.config();

import redis, { createClient } from 'redis';

const redisClient = createClient({
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT as string),
    },
});

redisClient.on('connect', () => {
    console.log('Redis is connected');
});

redisClient.on('error', (error) => {
    console.log('Redis error', error.message);
});

export const connectRedis = async () => await redisClient.connect();
export const disconnectRedis = async () => await redisClient.disconnect();
export const quitRedis = async () => await redisClient.quit();
export const redisGet = async (key: string) => await redisClient.get(key);
export const redisSet = async (key: string, value: string, options?: redis.SetOptions | undefined) => await redisClient.set(key, value, options);
export const redisDel = async (key: string) => await redisClient.del(key);