import { Struct } from '../../../struct';
import * as Cache from '../index';

export class HashCache {
  public get Key() {
    return this.key;
  }

  public Get(): string | undefined {
    return Cache.getValue(this.Key);
  }

  public Set(value: string) {
    Cache.setValue(this.Key, value);
  }

  public constructor(private key: string) { }
}
