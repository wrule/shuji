import { Struct } from '../index';
import { StructType } from '../type';
import { TsUnion } from '../union';

export class TsUnknow extends Struct {
  public get Type() {
    return StructType.Unknow;
  }

  public get StructHash() {
    return StructType.Unknow.toString();
  }

  public Equal(ts: Struct) {
    return this.StructHash === ts.StructHash;
  }

  public get IsBasic() {
    return true;
  }

  public Compare(ts: Struct): number {
    return ts.Type === this.Type ? 1 : 0;
  }

  public Contain(ts: Struct): boolean {
    return ts.Type === this.Type;
  }

  public Merge(ts: Struct): Struct {
    if (ts.Type === this.Type) {
      return this;
    } else {
      return new TsUnion([this, ts]);
    }
  }
}
