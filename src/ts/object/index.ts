import { TS } from '../index';
import { TsType } from '../type';
import { TsUnion } from '../union';
import { TsUndefined } from '../undefined';

export class TsObject extends TS {
  public get Type() {
    return TsType.Object;
  }

  public get StructHash() {
    return TsType.Object.toString();
  }

  public Equal(ts: TS) {
    return this.StructHash === ts.StructHash;
  }

  public get IsBasic() {
    return false;
  }

  public Compare(ts: TS): number {
    if (ts.Type === TsType.Object) {
      const object = ts as TsObject;
      const srcKeys = Array.from(this.Fields.keys());
      const bothKeys = srcKeys.filter((key) => object.Fields.has(key));
      if (bothKeys.length > 0) {
        const dstKeysCount = object.Fields.size;
        const keysCount = srcKeys.length > dstKeysCount ? srcKeys.length : dstKeysCount;
        const passRate = bothKeys.length / keysCount;
        let sum = 0;
        bothKeys.forEach((key) => {
          const srcType = this.Fields.get(key) as TS;
          const dstType = object.Fields.get(key) as TS;
          sum += (0.2 + srcType.Compare(dstType) * 0.8);
        });
        return (sum / bothKeys.length) * passRate;
      } else {
        return 0;
      }
    } else {
      return 0;
    }
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

  public Merge(ts: TS): TS {
    if (ts.Type === this.Type) {
      const object = ts as TsObject;
      const allKeys = Array.from(new Set(
        Array.from(this.Fields.keys())
          .concat(Array.from(object.Fields.keys()))
      ));
      const undefinedType = new TsUndefined();
      return new TsObject(new Map(allKeys.map((key) => {
        const srcType = this.Fields.get(key) || undefinedType;
        const dstType = object.Fields.get(key) || undefinedType;
        return [key, srcType.Merge(dstType)];
      })));
    } else {
      return new TsUnion([this, ts]);
    }
  }

  public constructor(
    private fields: Map<string, TS>,
  ) {
    super();
  }
}
