import { Struct } from '../../../struct';
import { Cache } from '../../index';

export class HashCache {
  public get Key() {
    return this.key;
  }

  public Get() {
    return Cache.GetValue(this.Key);
  }

  public Set(value: string) {
    Cache.SetValue(this.Key, value);
  }

  public constructor(private key: string) { }
}
