import { Struct } from '../index';
import { StructType } from '../type';
import { StructUnion } from '../union';

export class StructDate extends Struct {
  public get Type() {
    return StructType.Date;
  }

  public get IsBasic() {
    return true;
  }

  protected CalcHash() {
    return StructType.Date.toString();
  }

  protected iContain(ts: Struct): boolean {
    return this.Equal(ts);
  }

  protected iCompare(ts: Struct): number {
    return this.Equal(ts) ? 1 : 0;
  }

  protected iMerge(ts: Struct): Struct {
    if (this.Equal(ts)) {
      return this;
    } else {
      return new StructUnion([this, ts]);
    }
  }
}
