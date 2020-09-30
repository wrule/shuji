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

  public CalcHash() {
    return Hash(
      this.Members
        .map((member) => member.Hash)
        .sort((a, b) => a.localeCompare(b))
        .join('|')
    );
  }

  public get IsBasic() {
    return false;
  }

  public Equal(ts: Struct) {
    return this.Hash === ts.Hash;
  }

  public Contain(ts: Struct): boolean {
    if (ts.Type === this.Type) {
      const union = ts as StructUnion;
      return union.Members.every((member) => this.Contain(member));
    } else {
      return this.Members.some((member) => member.Contain(ts));
    }
  }

  public Compare(ts: Struct): number {
    return 0;
  }

  public Merge(ts: Struct): Struct {
    if (ts.Type === this.Type) {
      return this;
    } else {
      return new StructUnion([this, ts]);
    }
  }

  public constructor(
    private members: Struct[],
  ) {
    super();
  }
}
