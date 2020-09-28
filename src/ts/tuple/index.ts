import { TS } from '../index';
import { TsType } from '../type';

export class TsTuple extends TS {
  public get Type() {
    return TsType.Tuple;
  }

  public get IsBasic() {
    return false;
  }

  public Compare(ts: TS): number {
    return 0;
  }
}
