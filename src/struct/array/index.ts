import { Struct } from '../index';
import { StructType } from '../type';
import { TsUnion } from '../union';

export class TsArray extends Struct {
  public get Type() {
    return StructType.Array;
  }

  public get StructHash() {
    return StructType.Array.toString();
  }

  public Equal(ts: Struct) {
    return this.StructHash === ts.StructHash;
  }

  public get IsBasic() {
    return false;
  }

  public Compare(ts: Struct): number {
    if (ts.Type === StructType.Array) {
      const array = ts as TsArray;
      return this.ElementType.Compare(array.ElementType);
    } else {
      return 0;
    }
  }

  public Contain(ts: Struct): boolean {
    if (ts.Type === StructType.Array) {
      return this.ElementType.Contain((ts as TsArray).ElementType);
    } else {
      return false;
    }
  }

  public get ElementType() {
    return this.elementType;
  }

  public Merge(ts: Struct): Struct {
    if (ts.Type === this.Type) {
      const array = ts as TsArray;
      return new TsArray(this.ElementType.Merge(array.ElementType));
    } else {
      return new TsUnion([this, ts]);
    }
  }

  public constructor(
    private elementType: Struct,
  ) {
    super();
  }
}
