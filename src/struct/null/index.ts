import { Struct } from '../index';
import { StructType } from '../type';
import { TsUnion } from '../union';

export class TsNull extends Struct {
  public get Type() {
    return StructType.Null;
  }

  public get StructHash() {
    return StructType.Null.toString();
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
