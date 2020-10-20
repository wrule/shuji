import { Struct } from '../index';
import { StructType } from '../type';
import { StructUnion } from '../union';
import { StructTuple } from '../tuple';
import { StructObject } from '../object';
import { IJsObj } from '../IJsObj';
import { FromJsHub } from '../fromJsHub';

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

  protected iContain(ts: Struct): boolean {
    if (ts.Type === this.Type) {
      const array = ts as StructArray;
      return this.ElementStruct.Contain(array.ElementStruct);
    } else if (ts.Type === StructType.Tuple) {
      const tuple = ts as StructTuple;
      return tuple.ElementsStruct.every((struct) => this.ElementStruct.Contain(struct));
    } else {
      return false;
    }
  }

  protected iCompare(ts: Struct): number {
    if (ts.Type === this.Type) {
      const array = ts as StructArray;
      return this.ElementStruct.Compare(array.ElementStruct);
    } else {
      return 0;
    }
  }

  protected iMerge(ts: Struct): Struct {
    if (ts.Type === this.Type) {
      const array = ts as StructArray;
      return new StructArray(this.ElementStruct.Merge(array.ElementStruct), this.Desc);
    } else if (ts.Type === StructType.Tuple) {
      const tuple = ts as StructTuple;
      let result = this.ElementStruct;
      tuple.ElementsStruct.forEach((struct) => {
        result = result.Merge(struct);
      });
      return new StructArray(result, this.Desc);
    } else {
      return new StructUnion([this, ts], this.Desc);
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

  public iTsCode() {
    return this.ElementStruct.TsCode;
  }

  public ToJs(): IJsObj {
    return {
      desc: this.Desc,
      type: this.Type,
      element: this.ElementStruct.ToJs(),
    };
  }

  public static Parse(jsObj: IJsObj) {
    const element = jsObj.element as IJsObj;
    return new StructArray(FromJsHub(element), jsObj.desc);
  }

  public constructor(
    private elementStruct: Struct,
    desc: string,
  ) {
    super(desc);
    this.UpdateDesc(desc);
  }
}
