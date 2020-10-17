import { Struct } from '../../../struct';
import { Cache } from '../../index';

export class CompareCache {
  private key: string;

  public get Key() {
    return this.key;
  }

  public Get() {
    const value = Cache.GetValue(this.Key);
    if (value !== null) {
      return Number(value);
    } else {
      return null;
    }
  }

  public Set(value: number) {
    Cache.SetValue(this.Key, value.toString());
  }

  public constructor(struct1: Struct, struct2: Struct) {
    this.key = `compare:${struct1.Hash}-${struct2.Hash}`;
  }
}
