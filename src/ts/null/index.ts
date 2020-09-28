import { TS } from '../index';
import { TsType } from '../type';

export class TsNull extends TS {
  public get Type() {
    return TsType.Null;
  }

  public get IsBasic() {
    return true;
  }

  public Compare(ts: TS): number {
    return ts.Type === this.Type ? 1 : 0;
  }
}
