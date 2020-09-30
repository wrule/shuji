import { Struct } from '../index';
import { StructType } from '../type';

export class StructUnion extends Struct {
  public get Type() {
    return StructType.Union;
  }

  public get Hash() {
    return StructType.Union.toString();
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
    if (ts.Type === StructType.Union) {
      return (ts as StructUnion).Members.every((member) => this.Contain(member));
    } else {
      return this.Members.some((member) => member.Contain(ts));
    }
  }

  public get Members() {
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
