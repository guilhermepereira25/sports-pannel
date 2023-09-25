import { setRedisKey, getRedisKey } from '../../src/services/redis_services';

import dotenv from 'dotenv';

describe('Redis Services', () => {
  beforeAll(() => {
    dotenv.config();
  })

  it('should set and get a Redis key', async () => {
    const key = 'foo-key';
    const value = 'foo-value';

    // Set Redis key
    await setRedisKey(key, value);

    // Get Redis key
    const result = await getRedisKey(key);

    expect(result).toBe(value);
  });
});