import { TS } from '../index';
import { TsType } from '../type';

export class TsArray extends TS {
  public get Type() {
    return TsType.Array;
  }

  public get IsBasic() {
    return false;
  }

  public Compare(ts: TS): number {
    return 0;
  }

  public Contain(ts: TS): boolean {
    if (ts.Type === TsType.Array) {
      return this.ElementType.Contain((ts as TsArray).ElementType);
    } else {
      return false;
    }
  }

  public get ElementType() {
    return this.elementType;
  }

  public constructor(
    private elementType: TS,
  ) {
    super();
  }
}
