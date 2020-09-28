import { TS } from '../index';
import { TsType } from '../type';

export class TsUnion extends TS {
  public get Type() {
    return TsType.Union;
  }

  public get IsBasic() {
    return false;
  }
}
