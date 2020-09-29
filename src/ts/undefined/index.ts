import { TS } from '../index';
import { TsType } from '../type';
import { TsUnion } from '../union';

export class TsUndefined extends TS {
  public get Type() {
    return TsType.Undefined;
  }

  public get StructHash() {
    return TsType.Undefined.toString();
  }

  public Equal(ts: TS) {
    return this.StructHash === ts.StructHash;
  }

  public get IsBasic() {
    return true;
  }

  public Compare(ts: TS): number {
    return ts.Type === this.Type ? 1 : 0;
  }

  public Contain(ts: TS): boolean {
    return ts.Type === this.Type;
  }

  public Merge(ts: TS): TS {
    if (ts.Type === this.Type) {
      return this;
    } else {
      return new TsUnion([this, ts]);
    }
  }
}
