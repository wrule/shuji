import { Struct } from '../index';
import { StructType } from '../type';
import { Hash } from '../../utils';

export class StructUnion extends Struct {
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
    return Hash(
      this.Members
        .map((struct) => struct.Hash)
        .sort((a, b) => a.localeCompare(b))
        .join('|')
    );
  }

  protected iContain(ts: Struct): boolean {
    if (ts.Type === this.Type) {
      const union = ts as StructUnion;
      return union.Members.every((struct) => this.Contain(struct));
    } else {
      return this.Members.some((struct) => struct.Contain(ts));
    }
  }

  // TODO
  /**
   * 联合结构的相似度
   * 只要不完全一致,相似度都为0
   * @param ts 目标结构
   */
  protected iCompare(ts: Struct): number {
    return this.Equal(ts) ? 1 : 0;
  }

  protected iMerge(ts: Struct): Struct {
    if (ts.Type === this.Type) {
      const union = ts as StructUnion;
      let result: Struct = this;
      union.Members.forEach((struct) => {
        result = result.Merge(struct);
      });
      return result;
    } else {
      const nums = this.Members.map((struct) => struct.Compare(ts));
      // TODO 空状态?
      const maxNum = Math.max(...nums);
      if (maxNum > 0.3) {
        const maxIndex = nums.findIndex((num) => num === maxNum);
        const newMembers = this.Members.slice(0);
        const newStruct = newMembers[maxIndex].Merge(ts);
        newMembers.splice(maxIndex, 1, newStruct);
        return new StructUnion(newMembers);
      } else {
        return new StructUnion(this.Members.concat([ts]));
      }
    }
  }

  public constructor(
    private members: Struct[],
  ) {
    super();
  }
}
