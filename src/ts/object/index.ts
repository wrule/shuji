import { TS } from '../index';
import { TsType } from '../type';

export class TsObject extends TS {
  public get Type() {
    return TsType.Object;
  }

  public get IsBasic() {
    return false;
  }
}
