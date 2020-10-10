import { Struct } from '../index';
import { StructType } from '../type';
import { StructUnion } from '../union';
import { StructObject } from '../object';

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
    return new StructUnion([this, ts], this.Desc);
  }

  public get iOwnObjects() {
    return [];
  }

  protected iTsName(desc: string) {
    return 'Date';
  }

  protected iUpdateDesc(desc: string) {
    this.tsName = this.iTsName(desc);
  }

  protected iUpdateParent(parent?: StructObject) { }

  public constructor(desc: string) {
    super(desc);
    this.iUpdateDesc(desc);
  }
}
