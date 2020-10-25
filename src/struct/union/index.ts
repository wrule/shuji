import { Struct } from '../index';
import { StructType } from '../type';
import { StructObject } from '../object';
import { IJsObj } from '../IJsObj';
import { FromJsHub } from '../fromJs';

export class StructUnion extends Struct {
  /**
   * 联合成员的结构
   */
  public get Members() {
    return this.members;
  }

  public get Type() {
    return StructType.Union;
  }

  public get IsBasic() {
    return false;
  }

  protected CalcHash() {
    return this.cacheHash(
      `${this.Type}@` +
      this.Members
        .map((struct) => struct.Hash)
        .sort((a, b) => a.localeCompare(b))
        .join('|')
    );
  }

  protected CalcTsName() {
    const inner = this.Members
      .map((struct) => struct.TsName)
      .join(' | ');
    return `(${inner})`;
  }

  /**
   * 联合结构的包含
   * 联合结构内有任意一个结构包含非联合结构即可视为包含
   * 目标联合结构内的所有结构被本联合包含可视为联合之间的包含
   * @param struct 目标结构
   * @returns 是否包含
   */
  protected iContain(struct: Struct): boolean {
    if (struct.Type === this.Type) {
      const union = struct as StructUnion;
      return union.Members.every((structDst) => this.Contain(structDst));
    } else {
      return this.Members.some((structSrc) => structSrc.Contain(struct));
    }
  }

  /**
   * 联合结构的比较
   * 对于非联合结构,相似度取联合结构内所有结构和目标结构相比相似度最大的一个
   * 对于联合结构,相似度取目标联合结构内所有结构和本联合结构相比相似度最大的一个(上述递归定义)
   * @param struct 目标结构
   * @returns 相似度
   */
  protected iCompare(struct: Struct): number {
    let nums: number[] = [];
    if (struct.Type === this.Type) {
      const union = struct as StructUnion;
      nums = union.Members.map((structDst) => this.Compare(structDst));
    } else {
      nums = this.Members.map((structSrc) => structSrc.Compare(struct));
    }
    if (nums.length > 0) {
      return Math.max(...nums);
    } else {
      return 0;
    }
  }

  /**
   * 联合结构合并
   * @param struct 目标结构
   * @returns 合并生成的结构
   */
  protected iMerge(struct: Struct): Struct {
    if (this.Members.length < 1) {
      return struct;
    }
    if (struct.Type === this.Type) {
      // 拆开目标联合成员,递归合并
      const union = struct as StructUnion;
      let result: Struct = this;
      union.Members.forEach((structDst) => {
        result = result.Merge(structDst);
      });
      return result;
    } else {
      // 寻找到最相似的结构,若相似度大于阈值,则执行结构合并,否则执行追加联合成员合并
      const nums = this.Members.map((structSrc) => structSrc.Compare(struct));
      const maxNum = Math.max(...nums);
      if (maxNum >= 0.3) {
        const maxIndex = nums.findIndex((num) => num === maxNum);
        const newMembers = this.Members.slice(0);
        const newStruct = newMembers[maxIndex].Merge(struct);
        newMembers.splice(maxIndex, 1, newStruct);
        return new StructUnion(newMembers, this.Desc);
      } else {
        return new StructUnion(this.Members.concat([struct]), this.Desc);
      }
    }
  }

  protected iUpdateDesc(desc: string) {
    this.Members.forEach((struct, index) => {
      struct.UpdateDesc(`${desc}UM${index + 1}`);
      // struct.UpdateDesc(`${desc}UM${struct.Hash.slice(0, 8)}`);
    });
  }

  protected iUpdateParent(parent?: StructObject) {
    this.Members.forEach((struct) => {
      struct.UpdateParent(parent);
    });
  }

  public iOwnObjects() {
    const result: StructObject[] = [];
    this.Members.forEach((struct) => {
      result.push(...struct.OwnObjects);
    });
    return result;
  }

  public GetTsCode() {
    let result =
`
${
  this.Members
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
      members: this.Members.map((struct) => struct.ToJs()),
    };
  }

  public static FromJs(jsObj: IJsObj) {
    const members = jsObj.members as IJsObj[];
    return new StructUnion(members.map((item) => FromJsHub(item)), jsObj.desc);
  }

  public constructor(
    private members: Struct[],
    desc: string,
  ) {
    super(desc);
    this.iUpdateDesc(desc);
  }
}
