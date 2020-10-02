import { Struct } from '../index';
import { StructType } from '../type';
import { StructUnion } from '../union';

export class StructUndefined extends Struct {
  public get Type() {
    return StructType.Undefined;
  }

  public get IsBasic() {
    return true;
  }

  protected CalcHash() {
    return StructType.Undefined.toString();
  }

  public iContain(ts: Struct): boolean {
    return this.Equal(ts);
  }

  public iCompare(ts: Struct): number {
    return this.Equal(ts) ? 1 : 0;
  }

  public iMerge(ts: Struct): Struct {
    if (this.Equal(ts)) {
      return this;
    } else {
      return new StructUnion([this, ts]);
    }
  }

  public constructor() {
    super();
    this.hash = this.CalcHash();
  }
}
