import { ICache } from '../cache';
import Redis from 'ioredis';
const redis = new Redis();

export class RedisCache implements ICache {
  public async GetValue(key: string) {
    return await redis.get(key);
  }

  public async SetValue(key: string, value: any) {
    await redis.set(key, value);
  }
}
