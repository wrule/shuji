import { Struct } from '../../../struct';
import * as Cache from '../index';

export class ContainCache {
  private key: string;

  public get Key() {
    return this.key;
  }

  public get Value() {
    return Cache.getValue(this.Key);
  }

  public set Value(value: number) {
    Cache.setValue(this.Key, value);
  }

  public constructor(struct1: Struct, struct2: Struct) {
    this.key = `contain:${struct1.Hash}-${struct2.Hash}`;
  }
}
