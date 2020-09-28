import { TS } from '../index';
import { TsType } from '../type';

export class TsArray extends TS {
  public get Type() {
    return TsType.Array;
  }

  public get IsBasic() {
    return false;
  }
}
