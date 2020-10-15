import { Struct } from '../../../struct';
import { Cache } from '../../index';

export class HashCache {
  public get Key() {
    return this.key;
  }

  public async Get() {
    return await Cache.GetValue(this.Key);
  }

  public async Set(value: string) {
    await Cache.SetValue(this.Key, value);
  }

  public constructor(private key: string) { }
}
