import { Struct } from '../index';
import { StructType } from '../type';

export class StructUnion extends Struct {
  public get Members() {
    return this.members;
  }

  public get Type() {
    return StructType.Union;
  }

  // TODO
  public get Hash() {
    return StructType.Union.toString();
  }

  public get IsBasic() {
    return false;
  }

  public Equal(ts: Struct) {
    return this.Hash === ts.Hash;
  }

  public Contain(ts: Struct): boolean {
    if (ts.Type === StructType.Union) {
      return (ts as StructUnion).Members.every((member) => this.Contain(member));
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
