import { TS } from '../index';
import { TsType } from '../type';

export class TsUnion extends TS {
  public get Type() {
    return TsType.Union;
  }

  public get IsBasic() {
    return false;
  }

  public Compare(ts: TS): number {
    return 0;
  }

  public Contain(ts: TS): boolean {
    if (ts.Type === TsType.Union) {
      return (ts as TsUnion).Members.every((member) => this.Contain(member));
    } else {
      return this.Members.some((member) => member.Contain(ts));
    }
  }

  public get Members() {
    return this.members;
  }

  public constructor(
    private members: TS[],
  ) {
    super();
  }
}
