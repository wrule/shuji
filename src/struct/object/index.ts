import { Struct } from '../index';
import { StructType } from '../type';
import { StructUnion } from '../union';
import { StructUndefined } from '../undefined';
import { Hash } from '../../utils';
import Lodash from 'lodash';

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

  public get IsBasic() {
    return false;
  }

  protected CalcHash() {
    return Hash(
      Array.from(this.Fields)
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map((ary) => `${ary[0]}:${ary[1].Hash}`)
        .join(',')
    );
  }

  public get InterfaceName() {
    return `I${this.tsName}`;
  }

  public get ModuleName() {
    return this.tsName;
  }

  public get TsName() {
    if (this.Parent) {
      return `${this.Parent.ModuleName}.${this.InterfaceName}`;
    } else {
      return this.InterfaceName;
    }
  }

  public get TsDef() {
    let result = ''; 
    result += `
export interface ${this.InterfaceName} {
${Array.from(this.Fields)
  .map(([name, struct]) => `  '${name}': ${struct.TsName};`)
  .join('\n')}
}
`;
    if (this.SpaceObjects.length > 0) {
      result += `
export module ${this.ModuleName} {
${this.SpaceObjects.map((struct) => struct.TsDef.map((line) => `  ${line}`).join('\n')).join('\n\n')}
}`;
    }
    return result.trim().split('\n');
  }

  protected iContain(ts: Struct): boolean {
    if (ts.Type === this.Type) {
      const object = ts as StructObject;
      if (this.Fields.size === object.Fields.size) {
        return Array.from(object.Fields).every(([name, dstStruct]) => {
          const srcStruct = this.Fields.get(name);
          if (srcStruct) {
            return srcStruct.Contain(dstStruct);
          } else {
            return false;
          }
        });
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  protected iCompare(ts: Struct): number {
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

  protected iMerge(ts: Struct): Struct {
    if (ts.Type === this.Type && this.Compare(ts) >= 0.3) {
      const object = ts as StructObject;
      const allKeys = Array.from(new Set(
        Array.from(this.Fields.keys())
          .concat(Array.from(object.Fields.keys()))
      ));
      return new StructObject(new Map(
        allKeys.map((key) => {
          const undefinedType = new StructUndefined(key);
          const srcStruct = this.Fields.get(key) || undefinedType;
          const dstStruct = object.Fields.get(key) || undefinedType;
          return [key, srcStruct.Merge(dstStruct)];
        })
      ), this.Desc);
    } else {
      return new StructUnion([this, ts], this.Desc);
    }
  }

  public iOwnObjects() {
    return [this];
  }

  protected iUpdateTsName(desc: string) {
    this.tsName = Lodash.upperFirst(desc);
  }

  protected iUpdateDesc(desc: string) { }

  protected iUpdateParent(parent?: StructObject) { }

  protected initFieldsParent() {
    Array.from(this.Fields).map(([name, struct]) => {
      struct.UpdateParent(this);
    });
  }

  public constructor(
    private fields: Map<string, Struct>,
    desc: string,
  ) {
    super(desc);
    this.UpdateDesc(desc);
    this.initFieldsParent();
  }
}
