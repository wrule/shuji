import { Struct } from '../index';
import { TsType } from '../type';

export class TsUnion extends Struct {
  public get Type() {
    return TsType.Union;
  }

  public get StructHash() {
    return TsType.Union.toString();
  }

  public Equal(ts: Struct) {
    return this.StructHash === ts.StructHash;
  }

  public get IsBasic() {
    return false;
  }

  public Compare(ts: Struct): number {
    return 0;
  }

  public Contain(ts: Struct): boolean {
    if (ts.Type === TsType.Union) {
      return (ts as TsUnion).Members.every((member) => this.Contain(member));
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
      return new TsUnion([this, ts]);
    }
  }

  public constructor(
    private members: Struct[],
  ) {
    super();
  }
}
