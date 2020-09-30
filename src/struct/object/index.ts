import { Struct } from '../index';
import { StructType } from '../type';
import { StructUnion } from '../union';
import { StructUndefined } from '../undefined';

export class StructObject extends Struct {
  public get Type() {
    return StructType.Object;
  }

  public get Hash() {
    return StructType.Object.toString();
  }

  public Equal(ts: Struct) {
    return this.Hash === ts.Hash;
  }

  public get IsBasic() {
    return false;
  }

  public Compare(ts: Struct): number {
    if (ts.Type === StructType.Object) {
      const object = ts as StructObject;
      const srcKeys = Array.from(this.Fields.keys());
      const bothKeys = srcKeys.filter((key) => object.Fields.has(key));
      if (bothKeys.length > 0) {
        const dstKeysCount = object.Fields.size;
        const keysCount = srcKeys.length > dstKeysCount ? srcKeys.length : dstKeysCount;
        const passRate = bothKeys.length / keysCount;
        let sum = 0;
        bothKeys.forEach((key) => {
          const srcType = this.Fields.get(key) as Struct;
          const dstType = object.Fields.get(key) as Struct;
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

  public Contain(ts: Struct): boolean {
    if (ts.Type === StructType.Object) {
      const object = ts as StructObject;
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

  public Merge(ts: Struct): Struct {
    if (ts.Type === this.Type) {
      const object = ts as StructObject;
      const allKeys = Array.from(new Set(
        Array.from(this.Fields.keys())
          .concat(Array.from(object.Fields.keys()))
      ));
      const undefinedType = new StructUndefined();
      return new StructObject(new Map(allKeys.map((key) => {
        const srcType = this.Fields.get(key) || undefinedType;
        const dstType = object.Fields.get(key) || undefinedType;
        return [key, srcType.Merge(dstType)];
      })));
    } else {
      return new StructUnion([this, ts]);
    }
  }

  public constructor(
    private fields: Map<string, Struct>,
  ) {
    super();
  }
}
