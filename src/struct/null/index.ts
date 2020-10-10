import { Struct } from '../index';
import { StructType } from '../type';
import { StructUnion } from '../union';
import { StructObject } from '../object';

export class StructNull extends Struct {
  public get Type() {
    return StructType.Null;
  }

  public get IsBasic() {
    return true;
  }

  protected CalcHash() {
    return StructType.Null.toString();
  }

  protected iContain(ts: Struct): boolean {
    return this.Equal(ts);
  }

  protected iCompare(ts: Struct): number {
    return this.Equal(ts) ? 1 : 0;
  }

  protected iMerge(ts: Struct): Struct {
    return new StructUnion([this, ts], this.Desc);
  }

  public get iOwnObjects() {
    return [];
  }

  protected iUpdateTsName(desc: string) {
    return 'null';
  }

  protected iUpdateDesc(desc: string) {
    this.tsName = this.iUpdateTsName(desc);
  }

  protected iUpdateParent(parent?: StructObject) { }

  public constructor(desc: string) {
    super(desc);
    this.iUpdateDesc(desc);
  }
}
