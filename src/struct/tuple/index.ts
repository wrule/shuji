import { Struct } from '../index';
import { StructType } from '../type';
import { StructUnion } from '../union';

export class StructTuple extends Struct {
  public get Type() {
    return StructType.Tuple;
  }

  public get Hash() {
    return StructType.Tuple.toString();
  }

  public Equal(ts: Struct) {
    return this.Hash === ts.Hash;
  }

  public get IsBasic() {
    return false;
  }

  public Compare(ts: Struct): number {
    return 0;
  }

  public Contain(ts: Struct): boolean {
    if (ts.Type === StructType.Tuple) {
      const tuple = ts as StructTuple;
      if (this.Members.length >= tuple.Members.length) {
        return tuple.Members
          .every((member, index) => this.Members[index].Contain(member));
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  private get Members() {
    return this.members;
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
