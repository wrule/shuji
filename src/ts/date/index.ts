import { TS } from '../index';
import { TsType } from '../type';

export class TsDate extends TS {
  public get Type() {
    return TsType.Date;
  }

  public get IsBasic() {
    return true;
  }
}
