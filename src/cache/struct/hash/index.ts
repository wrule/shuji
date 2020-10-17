import { Cache } from '../../index';

export class HashCache {
  private key: string;

  public get Key() {
    return this.key;
  }

  public Get() {
    return Cache.GetValue(this.Key);
  }

  public Set(value: string) {
    Cache.SetValue(this.Key, value);
  }

  public constructor(key: string) {
    this.key = `hash:${key}`;
  }
}
