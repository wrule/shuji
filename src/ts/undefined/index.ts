import { TS } from '../index';
import { TsType } from '../type';

export class TsUndefined extends TS {
  public get Type() {
    return TsType.Undefined;
  }

  public get IsBasic() {
    return true;
  }

  public Compare(ts: TS): number {
    return ts.Type === this.Type ? 1 : 0;
  }
}
