import { TS } from '../index';
import { TsType } from '../type';

export class TsBoolean extends TS {
  public get Type() {
    return TsType.Boolean;
  }

  public get IsBasic() {
    return true;
  }

  public Compare(ts: TS): number {
    return ts.Type === this.Type ? 1 : 0;
  }
}
