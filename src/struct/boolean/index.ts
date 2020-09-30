import { Struct } from '../index';
import { StructType } from '../type';
import { StructUnion } from '../union';

export class StructBoolean extends Struct {
  public get Type() {
    return StructType.Boolean;
  }

  public get StructHash() {
    return StructType.Boolean.toString();
  }

  public get IsBasic() {
    return true;
  }

  public Equal(ts: Struct) {
    return this.StructHash === ts.StructHash;
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
      return new StructUnion([this, ts]);
    }
  }
}
