import { Struct } from '../../../struct';
import { Cache } from '../../index';

export class ContainCache {
  private key: string;

  public get Key() {
    return this.key;
  }

  public Get() {
    const value = Cache.GetValue(this.Key);
    if (value !== null) {
      return value === 'true';
    } else {
      return null;
    }
  }

  public Set(value: boolean) {
    Cache.SetValue(this.Key, value.toString());
  }

  public constructor(struct1: Struct, struct2: Struct) {
    this.key = `contain:${struct1.Hash}-${struct2.Hash}`;
  }
}
