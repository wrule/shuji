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

  protected iTsName(name: string) {
    const inner = this.Members
      .map((struct, index) => struct.TsName(name, index + 1))
      .join(' | ');
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
