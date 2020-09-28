import { TS } from '../index';
import { TsType } from '../type';

export class TsNumber extends TS {
  public get Type() {
    return TsType.Number;
  }

  public get IsBasic() {
    return true;
  }
}
