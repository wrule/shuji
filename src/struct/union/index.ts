import { Struct } from '../index';
import { StructType } from '../type';
import { StructObject } from '../object';
import { IJsObj } from '../IJsObj';
import { FromJsHub } from '../fromJsHub';

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
      .join('|');
    return `(${inner})`;
  }

  protected iContain(ts: Struct): boolean {
    if (ts.Type === this.Type) {
      const union = ts as StructUnion;
      return union.Members.every((struct) => this.Contain(struct));
    } else {
      return this.Members.some((struct) => struct.Contain(ts));
    }
  }

  protected iCompare(ts: Struct): number {
    let nums: number[] = [];
    if (ts.Type === this.Type) {
      const union = ts as StructUnion;
      nums = union.Members.map((struct) => this.Compare(struct));
    } else {
      nums = this.Members.map((struct) => struct.Compare(ts));
    }
    if (nums.length > 0) {
      return Math.max(...nums);
    } else {
      return 0;
    }
  }

  protected iMerge(ts: Struct): Struct {
    if (this.Members.length < 1) {
      return ts;
    }
    if (ts.Type === this.Type) {
      const union = ts as StructUnion;
      let result: Struct = this;
      union.Members.forEach((struct) => {
        result = result.Merge(struct);
      });
      return result;
    } else {
      const nums = this.Members.map((struct) => struct.Compare(ts));
      const maxNum = Math.max(...nums);
      if (maxNum >= 0.3) {
        const maxIndex = nums.findIndex((num) => num === maxNum);
        const newMembers = this.Members.slice(0);
        const newStruct = newMembers[maxIndex].Merge(ts);
        newMembers.splice(maxIndex, 1, newStruct);
        return new StructUnion(newMembers, this.Desc);
      } else {
        return new StructUnion(this.Members.concat([ts]), this.Desc);
      }
    }
  }

  protected iUpdateDesc(desc: string) {
    this.Members.forEach((struct, index) => {
      struct.UpdateDesc(`${desc}UM${index + 1}`);
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

  public iTsCode() {
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
    this.UpdateDesc(desc);
  }
}
