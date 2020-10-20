import { Struct } from '../index';
import { StructType } from '../type';
import { StructUnion } from '../union';
import { StructUndefined } from '../undefined';
import Lodash from 'lodash';
import { CodeCache } from '../../cache/cache/code';

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
    return this.cacheHash(
      `${this.Type}@` +
      Array.from(this.Fields)
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([name, value]) => `${name}=${value.Hash}`)
        .join(',')
    );
  }

  protected CalcTsName() {
    if (this.Parent) {
      return `${this.Parent.ModuleName}.${this.InterfaceName}`;
    } else {
      return this.InterfaceName;
    }
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

  protected iUpdateDesc(desc: string) { }

  protected iUpdateParent(parent?: StructObject) { }

  public iOwnObjects() {
    return [this];
  }

  /**
   * 用于链接代码
   * @param code 模板代码
   */
  private linkCode(code: string) {
    let result = code;
    result = result.replace('${InterfaceName}', this.InterfaceName);
    result = result.replace('${ModuleName}', this.ModuleName);
    return result;
  }

  public iTsCode() {
    let result = '';
    const codeCache = new CodeCache(this.Hash);
    const cacheValue = codeCache.Get();
    if (cacheValue !== null) {
      result = cacheValue;
    } else {
      result =
`
export interface \$\{InterfaceName\} {
${
  Array.from(this.Fields)
    .map(([name, struct]) => `  '${name}': ${struct.TsName};`)
    .join('\n')
}
}
`;
      if (this.SpaceObjects.length > 0) {
        result +=
`
export module \$\{ModuleName\} {
${
  this.SpaceObjects
    .map((struct) => struct.TsCodeLines.map((line) => `  ${line}`).join('\n'))
    .join('\n\n')
}
}
`;
      }
      result = result.trim();
      codeCache.Set(result);
    }
    return this.linkCode(result);
  }

  /**
   * 模块名称
   */
  public get ModuleName() {
    return Lodash.upperFirst(this.Desc);
  }

  /**
   * 接口名称
   */
  public get InterfaceName() {
    return `I${this.ModuleName}`;
  }

  /**
   * 初始化字段结构的父结构
   */
  protected initFieldsParent() {
    Array.from(this.Fields).map(([name, struct]) => {
      struct.UpdateParent(this);
    });
  }

  public ToJs() {
    return {
      desc: this.Desc,
      type: this.Type,
      fields: Array.from(this.Fields).map(([name, struct]) => [
        name,
        struct.ToJs(),
      ]),
    };
  }

  public static Parse(obj: any) {
    return new StructObject({ } as any, obj.desc);
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
