import { Struct } from '../../../struct';
import { Cache } from '../../index';

export class CompareCache {
  private key: string;
  private reverseKey: string;

  public get Key() {
    return this.key;
  }

  public get ReverseKey() {
    return this.reverseKey;
  }

  public Get() {
    const value = Cache.GetValue(this.Key);
    if (value !== null) {
      return Number(value);
    } else {
      const reverseValue = Cache.GetValue(this.ReverseKey);
      if (reverseValue !== null) {
        return Number(reverseValue);
      } else {
        return null;
      }
    }
  }

  public Set(value: number) {
    Cache.SetValue(this.Key, value.toString());
  }

  public constructor(struct1: Struct, struct2: Struct) {
    this.key = `compare:${struct1.Hash}-${struct2.Hash}`;
    this.reverseKey = `compare:${struct2.Hash}-${struct1.Hash}`;
  }
}
