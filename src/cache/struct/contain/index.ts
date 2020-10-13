import { Struct } from '../../../struct';
import * as Cache from '../index';

export class ContainCache {
  private key: string;
  private flag: boolean = false;
  private value: boolean | undefined;

  public get Key() {
    return this.key;
  }

  public get Value(): boolean | undefined {
    if (this.flag) {
      return this.value;
    } else {
      const result = Cache.getValue(this.Key);
      this.value = result;
      this.flag = true;
      return result;
    }
  }

  public set Value(value: boolean | undefined) {
    Cache.setValue(this.Key, value);
    this.flag = false;
  }

  public constructor(struct1: Struct, struct2: Struct) {
    this.key = `contain:${struct1.Hash}-${struct2.Hash}`;
  }
}
