'use strict'

import { debug } from 'console';
import { redisClient } from '../config/services/redis.js';

export async function setRedisKey(key, value) {
    debug(`Setting Redis key ${key} to ${value}`);

    try {
        await redisClient.connect();

        redisClient.on('error', (err) => {
            console.error(err);
        });

        const setRedisResult = await redisClient.set(key, value);
        await redisClient.disconnect();
        debug(`setRedisResult: ${setRedisResult}`);

        return setRedisResult ? true : false;
    } catch (err) {
        console.error(err);
    }
}

export async function getRedisKey(key) {
    debug(`Getting Redis key ${key}`);

    try {
        await redisClient.connect();

        redisClient.on('error', (err) => {
            console.error(err);
        });
    
        let value = await redisClient.get(key);
        await redisClient.disconnect();
        debug(`getRedisValue: ${value}`);
    
        return !value ? false : value;
    } catch (err) {
        console.error(err);
    }
}