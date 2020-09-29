import { TS } from '../index';
import { TsType } from '../type';
import { TsUnion } from '../union';

export class TsBoolean extends TS {
  public get Type() {
    return TsType.Boolean;
  }

  public get StructHash() {
    return TsType.Boolean.toString();
  }

  public get IsBasic() {
    return true;
  }

  public Equal(ts: TS) {
    return this.StructHash === ts.StructHash;
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
