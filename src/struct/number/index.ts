import { Struct } from '../index';
import { StructType } from '../type';
import { StructUnion } from '../union';

export class StructNumber extends Struct {
  public get Type() {
    return StructType.Number;
  }

  public get Hash() {
    return StructType.Number.toString();
  }

  public Equal(ts: Struct) {
    return this.Hash === ts.Hash;
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
      return new StructUnion([this, ts]);
    }
  }
}
