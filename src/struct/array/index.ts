import { Struct } from '../index';
import { StructType } from '../type';
import { StructUnion } from '../union';

export class StructArray extends Struct {
  public get Type() {
    return StructType.Array;
  }

  public get Hash() {
    return StructType.Array.toString();
  }

  public Equal(ts: Struct) {
    return this.Hash === ts.Hash;
  }

  public get IsBasic() {
    return false;
  }

  public Compare(ts: Struct): number {
    if (ts.Type === StructType.Array) {
      const array = ts as StructArray;
      return this.ElementType.Compare(array.ElementType);
    } else {
      return 0;
    }
  }

  public Contain(ts: Struct): boolean {
    if (ts.Type === StructType.Array) {
      return this.ElementType.Contain((ts as StructArray).ElementType);
    } else {
      return false;
    }
  }

  public get ElementType() {
    return this.elementType;
  }

  public Merge(ts: Struct): Struct {
    if (ts.Type === this.Type) {
      const array = ts as StructArray;
      return new StructArray(this.ElementType.Merge(array.ElementType));
    } else {
      return new StructUnion([this, ts]);
    }
  }

  public constructor(
    private elementType: Struct,
  ) {
    super();
  }
}
