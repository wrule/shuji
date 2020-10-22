import { Struct } from '../index';
import { StructType } from '../type';
import { StructUnion } from '../union';
import { StructUndefined } from '../undefined';
import Lodash from 'lodash';
import { CodeCache } from '../../cache/cache/code';
import { IJsObj } from '../IJsObj';
import { FromJsHub } from '../fromJs';

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

  /**
   * 计算对象结构的Hash
   * 对象结构的Hash为所有字段排序后拼装出的Hash
   * 具体可看下面代码
   */
  protected CalcHash() {
    return this.cacheHash(
      `${this.Type}@` +
      Array.from(this.Fields)
        .sort(([name1], [name2]) => name1.localeCompare(name2))
        .map(([name, struct]) => `${name}=${struct.Hash}`)
        .join(',')
    );
  }

  /**
   * 计算对象结构的TsName
   * 如果此对象结构有父级结构的话则为其加上模块作用域描述
   * 如果没有的话,直接返回InterfaceName
   */
  protected CalcTsName() {
    if (this.Parent) {
      return `${this.Parent.ModuleName}.${this.InterfaceName}`;
    } else {
      return this.InterfaceName;
    }
  }

  /**
   * 对象结构的包含运算
   * 对象接口包含的条件为所有字段必须相同,并且字段类型满足包含的递归定义
   * @param struct 目标结构
   * @returns 是否包含
   */
  protected iContain(struct: Struct): boolean {
    if (struct.Type === this.Type) {
      const object = struct as StructObject;
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

  /**
   * 对象结构的比较运算
   * 对象结构相似度是共同字段相似度的平均数的递归定义
   * @param struct 目标结构
   * @returns 相似度
   */
  protected iCompare(struct: Struct): number {
    if (struct.Type === this.Type) {
      const object = struct as StructObject;
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

  /**
   * 对象结构的合并运算
   * @param struct 目标结构
   * @returns 合并产生的新结构
   */
  protected iMerge(struct: Struct): Struct {
    if (struct.Type === this.Type && this.Compare(struct) >= 0.3) {
      const object = struct as StructObject;
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
      return new StructUnion([this, struct], this.Desc);
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

  public GetTsCode() {
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

  public ToJs(): IJsObj {
    return {
      desc: this.Desc,
      type: this.Type,
      fields: Array.from(this.Fields).map(([name, struct]) => ([
        name,
        struct.ToJs(),
      ])),
    };
  }

  public static FromJs(jsObj: IJsObj) {
    const fields = jsObj.fields as [string, IJsObj][];
    const fieldsMap = new Map<string, Struct>(
      fields.map(
        ([name, jsObj]) => [name, FromJsHub(jsObj)]
      )
    );
    return new StructObject(fieldsMap, jsObj.desc);
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
