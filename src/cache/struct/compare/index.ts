import { Struct } from '../../../struct';
import * as Cache from '../index';

export class CompareCache {
  private key: string;

  public get Key() {
    return this.key;
  }

  public Get() {
    // console.log('compare', Cache.getValue(this.Key));
    return Cache.GetValue(this.Key);
  }

  public Set(value: number) {
    Cache.SetValue(this.Key, value);
  }

  public constructor(struct1: Struct, struct2: Struct) {
    this.key = `compare:${struct1.Hash}-${struct2.Hash}`;
  }
}
