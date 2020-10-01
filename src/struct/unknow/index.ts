import { Struct } from '../index';
import { StructType } from '../type';
import { StructUnion } from '../union';

export class StructUnknow extends Struct {
  public get Type() {
    return StructType.Unknow;
  }

  protected CalcHash() {
    return StructType.Unknow.toString();
  }

  public get IsBasic() {
    return true;
  }

  public Equal(ts: Struct) {
    return this.Hash === ts.Hash;
  }

  public Contain(ts: Struct): boolean {
    return this.Equal(ts);
  }

  public Compare(ts: Struct): number {
    return this.Equal(ts) ? 1 : 0;
  }

  public iMerge(ts: Struct): Struct {
    if (this.Equal(ts)) {
      return this;
    } else {
      return new StructUnion([this, ts]);
    }
  }
}
