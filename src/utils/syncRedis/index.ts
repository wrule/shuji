import deasync from 'deasync';
import Redis from 'ioredis';

export class SyncRedis extends Redis {
  private syncGet: any;
  private syncSet: any;

  public SyncGet(key: Redis.KeyType): string | null {
    return this.syncGet(key);
  }

  SyncSet(key: Redis.KeyType, value: Redis.ValueType): Redis.Ok;
  SyncSet(key: Redis.KeyType, value: Redis.ValueType, setMode: string | any[]): Redis.Ok | null;
  SyncSet(key: Redis.KeyType, value: Redis.ValueType, expiryMode: string, time: number | string): Redis.Ok;
  SyncSet(
      key: Redis.KeyType,
      value: Redis.ValueType,
      expiryMode: string,
      time: number | string,
      setMode: number | string,
  ): Redis.Ok | null;
  public SyncSet(...args: any[]) {
    return this.syncSet(...args);
  }

  public constructor() {
    super();
    this.syncGet = deasync(super.get);
    this.syncSet = deasync(super.set);
    // 可以用rpush保存
    // this.rpush
  }
}
