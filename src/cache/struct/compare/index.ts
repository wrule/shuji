import { Struct } from '../../../struct';
import * as Cache from '../index';

export class CompareCache {
  private key: string;

  public get Key() {
    return this.key;
  }

  public Get(): number | undefined {
    return Cache.getValue(this.Key);
  }

  public Set(value: number) {
    Cache.setValue(this.Key, value);
  }

  public constructor(struct1: Struct, struct2: Struct) {
    this.key = `compare:${struct1.Hash}-${struct2.Hash}`;
  }
}
