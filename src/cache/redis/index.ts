import { ICache } from '../cache';
import { SyncRedis } from '../../utils/syncRedis';
const redis = new SyncRedis();

export class RedisCache implements ICache {
  public GetValue(key: string) {
    return redis.SyncGet(key);
  }

  public SetValue(key: string, value: string) {
    redis.SyncSet(key, value);
  }
}
