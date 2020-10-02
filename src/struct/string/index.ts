import { Struct } from '../index';
import { StructType } from '../type';
import { StructUnion } from '../union';

export class StructString extends Struct {
  public get Type() {
    return StructType.String
  }

  protected CalcHash() {
    return StructType.String.toString();
  }

  public get IsBasic() {
    return true;
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
}
