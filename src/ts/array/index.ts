import { TS } from '../index';
import { TsType } from '../type';
import { TsUnion } from '../union';

export class TsArray extends TS {
  public get Type() {
    return TsType.Array;
  }

  public get StructHash() {
    return TsType.Array.toString();
  }

  public Equal(ts: TS) {
    return this.StructHash === ts.StructHash;
  }

  public get IsBasic() {
    return false;
  }

  public Compare(ts: TS): number {
    if (ts.Type === TsType.Array) {
      const array = ts as TsArray;
      return this.ElementType.Compare(array.ElementType);
    } else {
      return 0;
    }
  }

  public Contain(ts: TS): boolean {
    if (ts.Type === TsType.Array) {
      return this.ElementType.Contain((ts as TsArray).ElementType);
    } else {
      return false;
    }
  }

  public get ElementType() {
    return this.elementType;
  }

  public Merge(ts: TS): TS {
    if (ts.Type === this.Type) {
      const array = ts as TsArray;
      return new TsArray(this.ElementType.Merge(array.ElementType));
    } else {
      return new TsUnion([this, ts]);
    }
  }

  public constructor(
    private elementType: TS,
  ) {
    super();
  }
}
