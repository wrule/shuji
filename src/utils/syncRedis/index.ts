import deasync from 'deasync';
import Redis from 'ioredis';
const redis = new Redis();

class SyncRedis {
  private syncGet: (key: Redis.KeyType) => string | null;
  private syncSet: (key: Redis.KeyType, value: Redis.ValueType) => 'OK' | null;

  public Get(key: Redis.KeyType): string | null {
    return this.syncGet(key);
  }


  Set(key: KeyType, value: Redis.ValueType, callback: Redis.Callback<Redis.Ok>): void;
  Set(key: KeyType, value: Redis.ValueType, setMode: string | any[], callback: Redis.Callback<Redis.Ok | null>): void;
  public Set(key: Redis.KeyType, value: Redis.ValueType): 'OK' | null {
    return this.syncSet(key, value);
  }

  public constructor(
    private redis: Redis.Redis,
  ) {
    this.syncGet = deasync(redis.get);
    this.syncSet = deasync(redis.set);
  }
}
