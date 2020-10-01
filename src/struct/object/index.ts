import { Struct } from '../index';
import { StructType } from '../type';
import { StructUnion } from '../union';
import { StructUndefined } from '../undefined';
import { Hash } from '../../utils';

export class StructObject extends Struct {
  /**
   * 对象结构的字段
   */
  public get Fields() {
    return this.fields;
  }

  public get Type() {
    return StructType.Object;
  }

  public CalcHash() {
    return Hash(
      Array.from(this.Fields)
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map((ary) => `${ary[0]}:${ary[1].Hash}`)
        .join(',')
    );
  }

  public get IsBasic() {
    return false;
  }

  public Equal(ts: Struct) {
    return this.Hash === ts.Hash;
  }

  public Contain(ts: Struct): boolean {
    if (ts.Type === this.Type) {
      const object = ts as StructObject;
      return Array.from(object.Fields).every((ary) => {
        const key = ary[0];
        const dstStruct = ary[1];
        const srcStruct = this.Fields.get(key);
        if (srcStruct) {
          return srcStruct.Contain(dstStruct);
        } else {
          return false;
        }
      });
    } else {
      return false;
    }
  }

  public Compare(ts: Struct): number {
    if (ts.Type === this.Type) {
      const object = ts as StructObject;
      const srcKeys = Array.from(this.Fields.keys());
      const bothKeys = srcKeys.filter((key) => object.Fields.has(key));
      if (bothKeys.length > 0) {
        const dstKeysCount = object.Fields.size;
        const keysCount = srcKeys.length > dstKeysCount ? srcKeys.length : dstKeysCount;
        const passRate = bothKeys.length / keysCount;
        let sum = 0;
        bothKeys.forEach((key) => {
          const srcStruct = this.Fields.get(key) as Struct;
          const dstStruct = object.Fields.get(key) as Struct;
          sum += srcStruct.Compare(dstStruct);
        });
        return (sum / bothKeys.length) * passRate;
      } else {
        return 0;
      }
    } else {
      return 0;
    }
  }

  public Merge(ts: Struct): Struct {
    if (ts.Type === this.Type) {
      const object = ts as StructObject;
      const allKeys = Array.from(new Set(
        Array.from(this.Fields.keys())
          .concat(Array.from(object.Fields.keys()))
      ));
      const undefinedType = new StructUndefined();
      return new StructObject(new Map(
        allKeys.map((key) => {
          const srcStruct = this.Fields.get(key) || undefinedType;
          const dstStruct = object.Fields.get(key) || undefinedType;
          return [key, srcStruct.Merge(dstStruct)];
        })
      ));
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
