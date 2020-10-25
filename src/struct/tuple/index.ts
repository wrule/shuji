import { Struct } from '../index';
import { StructType } from '../type';
import { StructUnion } from '../union';
import { StructUndefined } from '../undefined';
import { StructObject } from '../object';
import { IJsObj } from '../IJsObj';
import { FromJsHub } from '../fromJs';

export class StructTuple extends Struct {
  /**
   * 元组元素的结构列表
   */
  public get ElementsStruct() {
    return this.elementsStruct;
  }

  public get Type() {
    return StructType.Tuple;
  }

  public get IsBasic() {
    return false;
  }

  protected CalcHash() {
    return this.cacheHash(
      `${this.Type}@` +
      this.ElementsStruct.map((struct) => struct.Hash).join(',')
    );
  }

  protected CalcTsName() {
    const inner = this.ElementsStruct
      .map((struct) => struct.TsName)
      .join(', ');
    return `[${inner}]`;
  }

  /**
   * 元组结构的包含
   * 元组结构只可能包含长度相等的元组结构
   * @param struct 目标结构
   * @returns 是否包含
   */
  protected iContain(struct: Struct): boolean {
    if (struct.Type === this.Type) {
      const tuple = struct as StructTuple;
      if (this.ElementsStruct.length === tuple.ElementsStruct.length) {
        return tuple.ElementsStruct
          .every((structDst, index) => this.ElementsStruct[index].Contain(structDst));
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  /**
   * 元组结构的相似度比较
   * 比较方法为最小长度相似区域比较平均值乘以通过率
   * @param struct 目标结构
   * @returns 相似度
   */
  protected iCompare(struct: Struct): number {
    if (struct.Type === this.Type) {
      const tuple = struct as StructTuple;
      const srcCount = this.ElementsStruct.length;
      const dstCount = tuple.ElementsStruct.length;
      const smallStructs = srcCount < dstCount ? this.ElementsStruct : tuple.ElementsStruct;
      const bigStructs = srcCount >= dstCount ? this.ElementsStruct : tuple.ElementsStruct;
      const passRate = smallStructs.length / bigStructs.length;
      let sum = 0;
      smallStructs.forEach((structSmall, index) => {
        sum += structSmall.Compare(bigStructs[index]);
      });
      return (sum / smallStructs.length) * passRate;
    } else {
      return 0;
    }
  }

  /**
   * 元组结构的合并
   * @param struct 目标结构
   * @returns 合并产生的新的结构
   */
  protected iMerge(struct: Struct): Struct {
    if (struct.Type === this.Type) {
      const tuple = struct as StructTuple;
      const srcCount = this.ElementsStruct.length;
      const dstCount = tuple.ElementsStruct.length;
      const smallStructs = srcCount < dstCount ? this.ElementsStruct : tuple.ElementsStruct;
      const bigStructs = srcCount >= dstCount ? this.ElementsStruct : tuple.ElementsStruct;
      return new StructTuple(
        bigStructs.map((structSrc, index) => {
          const structDst = smallStructs[index] || new StructUndefined(structSrc.Desc);
          return structSrc.Merge(structDst);
        }),
        this.Desc,
      );
    } else if (struct.Type === StructType.Array) {
      // 数组则应用反向合并
      return struct.Merge(this);
    } else {
      return new StructUnion([this, struct], this.Desc);
    }
  }

  protected iUpdateDesc(desc: string) {
    this.ElementsStruct.forEach((struct, index) => {
      struct.UpdateDesc(`${desc}TE${index + 1}`);
    });
  }

  protected iUpdateParent(parent?: StructObject) {
    this.ElementsStruct.forEach((struct) => {
      struct.UpdateParent(parent);
    });
  }

  public iOwnObjects() {
    const result: StructObject[] = [];
    this.ElementsStruct.forEach((struct) => {
      result.push(...struct.OwnObjects);
    });
    return result;
  }

  public GetTsCode() {
    let result =
`
${
  this.ElementsStruct
    .map((struct) => struct.TsCode)
    .filter((text) => text.trim())
    .join('\n\n')
}
`;
    return result.trim();
  }

  public ToJs(): IJsObj {
    return {
      desc: this.Desc,
      type: this.Type,
      elements: this.ElementsStruct.map((struct) => struct.ToJs()),
    };
  }

  public static FromJs(jsObj: IJsObj) {
    const elements = jsObj.elements as IJsObj[];
    return new StructTuple(elements.map((item) => FromJsHub(item)), jsObj.desc);
  }

  public constructor(
    private elementsStruct: Struct[],
    desc: string,
  ) {
    super(desc);
    this.iUpdateDesc(desc);
  }
}
