import { Struct } from '../index';
import { StructType } from '../type';
import { StructUnion } from '../union';
import { StructTuple } from '../tuple';
import { StructObject } from '../object';
import { IJsObj } from '../IJsObj';
import { FromJsHub } from '../fromJs';

export class StructArray extends Struct {
  /**
   * 数组元素的结构
   */
  public get ElementStruct() {
    return this.elementStruct;
  }

  public get Type() {
    return StructType.Array;
  }

  public get IsBasic() {
    return false;
  }

  protected CalcHash() {
    return this.cacheHash(`${this.Type}@${this.ElementStruct.Hash}[]`);
  }

  protected CalcTsName() {
    return `${this.ElementStruct.TsName}[]`;
  }

  /**
   * 数组结构的包含判断
   * 数组结构只有可能包含数组结构或元组结构
   * @param struct 目标结构
   * @returns 是否包含
   */
  protected iContain(struct: Struct): boolean {
    if (struct.Type === this.Type) {
      const array = struct as StructArray;
      return this.ElementStruct.Contain(array.ElementStruct);
    } else if (struct.Type === StructType.Tuple) {
      const tuple = struct as StructTuple;
      return tuple.ElementsStruct.every((structDst) => this.ElementStruct.Contain(structDst));
    } else {
      return false;
    }
  }

  /**
   * 数组结构的比较相似度
   * @param struct 目标结构
   * @returns 相似度
   */
  protected iCompare(struct: Struct): number {
    if (struct.Type === this.Type) {
      const array = struct as StructArray;
      return this.ElementStruct.Compare(array.ElementStruct);
    } else {
      return 0;
    }
  }

  /**
   * 数组结构的合并
   * 数据结构只能与数组结构或元组结构合并
   * @param struct 目标结构
   * @returns 合并生成的新结构
   */
  protected iMerge(struct: Struct): Struct {
    if (struct.Type === this.Type) {
      const array = struct as StructArray;
      return new StructArray(this.ElementStruct.Merge(array.ElementStruct), this.Desc);
    } else if (struct.Type === StructType.Tuple) {
      const tuple = struct as StructTuple;
      let result = this.ElementStruct;
      tuple.ElementsStruct.forEach((structDst) => {
        result = result.Merge(structDst);
      });
      return new StructArray(result, this.Desc);
    } else {
      return new StructUnion([this, struct], this.Desc);
    }
  }

  protected iUpdateDesc(desc: string) {
    this.ElementStruct.UpdateDesc(`${desc}AE`);
  }

  protected iUpdateParent(parent?: StructObject) {
    this.ElementStruct.UpdateParent(parent);
  }

  public iOwnObjects() {
    return this.ElementStruct.OwnObjects;
  }

  public GetTsCode() {
    return this.ElementStruct.TsCode;
  }

  public ToJs(): IJsObj {
    return {
      desc: this.Desc,
      type: this.Type,
      element: this.ElementStruct.ToJs(),
    };
  }

  public static FromJs(jsObj: IJsObj) {
    const element = jsObj.element as IJsObj;
    return new StructArray(FromJsHub(element), jsObj.desc);
  }

  public constructor(
    private elementStruct: Struct,
    desc: string,
  ) {
    super(desc);
    this.iUpdateDesc(desc);
  }
}
