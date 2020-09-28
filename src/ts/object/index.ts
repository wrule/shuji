import { TS } from '../index';
import { TsType } from '../type';

export class TsObject extends TS {
  public get Type() {
    return TsType.Object;
  }

  public get IsBasic() {
    return false;
  }

  public Compare(ts: TS): number {
    return 0;
  }

  public Contain(ts: TS): boolean {
    if (ts.Type === TsType.Object) {
      const object = ts as TsObject;
      return Array.from(object.Fields).every((ary) => {
        const key = ary[0];
        const dstType = ary[1];
        const srcType = this.Fields.get(key);
        if (srcType) {
          return srcType.Contain(dstType);
        } else {
          return false;
        }
      });
    } else {
      return false;
    }
  }

  public get Fields() {
    return this.fields;
  }

  public constructor(
    private fields: Map<string, TS>,
  ) {
    super();
  }
}
