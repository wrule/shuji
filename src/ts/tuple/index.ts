import { TS } from '../index';
import { TsType } from '../type';
import { TsUnion } from '../union';

export class TsTuple extends TS {
  public get Type() {
    return TsType.Tuple;
  }

  public get IsBasic() {
    return false;
  }

  public Compare(ts: TS): number {
    return 0;
  }

  public Contain(ts: TS): boolean {
    if (ts.Type === TsType.Tuple) {
      const tuple = ts as TsTuple;
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

  public Merge(ts: TS): TS {
    if (ts.Type === this.Type) {
      return this;
    } else {
      return new TsUnion([this, ts]);
    }
  }

  public constructor(
    private members: TS[],
  ) {
    super();
  }
}
