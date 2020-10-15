import deasync from 'deasync';
import Redis from 'ioredis';


export class SyncRedis extends Redis {
  private syncGet: any;
  private syncSet: any;

  public SyncGet(key: Redis.KeyType): string | null {
    return this.syncGet(key);
  }

  SyncSet(key: KeyType, value: Redis.ValueType): void;
  SyncSet(key: KeyType, value: Redis.ValueType, setMode: string | any[]): void;
  SyncSet(key: KeyType, value: Redis.ValueType, expiryMode: string, time: number | string): void;
  SyncSet(
      key: KeyType,
      value: Redis.ValueType,
      expiryMode: string,
      time: number | string,
      setMode: number | string,
  ): void;
  public SyncSet(...args: any[]): Redis.Ok | null {
    return this.syncSet(...args);
  }

  public constructor() {
    super();
    this.syncGet = deasync(super.get);
    this.syncSet = deasync(super.set);
  }
}
