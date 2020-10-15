import { Struct } from '../../../struct';
import { Cache } from '../../index';

export class CompareCache {
  private key: string;

  public get Key() {
    return this.key;
  }

  public async Get() {
    // console.log('compare', Cache.getValue(this.Key));
    return await Cache.GetValue(this.Key);
  }

  public async Set(value: number) {
    await Cache.SetValue(this.Key, value);
  }

  public constructor(struct1: Struct, struct2: Struct) {
    this.key = `compare:${struct1.Hash}-${struct2.Hash}`;
  }
}
