import { TS } from '../index';
import { TsType } from '../type';

export class TsString extends TS {
  public get Type() {
    return TsType.String
  }

  public get IsBasic() {
    return true;
  }
}
