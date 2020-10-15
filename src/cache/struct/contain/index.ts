import { Struct } from '../../../struct';
import { Cache } from '../../index';

export class ContainCache {
  private key: string;

  public get Key() {
    return this.key;
  }

  public async Get() {
    // console.log('contain', Cache.getValue(this.Key));
    return await Cache.GetValue(this.Key);
  }

  public async Set(value: boolean) {
    await Cache.SetValue(this.Key, value);
  }

  public constructor(struct1: Struct, struct2: Struct) {
    this.key = `contain:${struct1.Hash}-${struct2.Hash}`;
  }
}
