import { Struct } from '../index';
import { StructType } from '../type';
import { StructObject } from '../object';

export class StructUnknow extends Struct {
  public get Type() {
    return StructType.Unknow;
  }

  public get IsBasic() {
    return true;
  }

  protected CalcHash() {
    return StructType.Unknow.toString();
  }

  protected iContain(ts: Struct): boolean {
    return this.Equal(ts);
  }

  protected iCompare(ts: Struct): number {
    return this.Equal(ts) ? 1 : 0;
  }

  protected iMerge(ts: Struct): Struct {
    return ts;
  }

  public get iOwnObjects() {
    return [];
  }

  protected iTsName(desc: string) {
    return 'any';
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
