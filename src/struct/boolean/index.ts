import { Struct } from '../index';
import { StructType } from '../type';
import { StructUnion } from '../union';
import { StructObject } from '../object';

export class StructBoolean extends Struct {
  public get Type() {
    return StructType.Boolean;
  }

  public get IsBasic() {
    return true;
  }

  protected CalcHash() {
    return StructType.Boolean.toString();
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

  public iOwnObjects() {
    return [];
  }

  protected iUpdateTsName(desc: string) {
    this.tsName = 'boolean';
  }

  protected iUpdateDesc(desc: string) { }

  protected iUpdateParent(parent?: StructObject) { }

  public TsDef() {
    return [];
  }

  public constructor(desc: string) {
    super(desc);
    this.UpdateDesc(desc);
  }
}
