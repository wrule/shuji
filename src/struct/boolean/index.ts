import { Struct } from '../index';
import { StructType } from '../type';
import { StructUnion } from '../union';

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

  public get iOwnObjects() {
    return [];
  }

  protected iUpdateDesc(name: string) {
    this.tsName = 'boolean';
  }

  public constructor(desc: string) {
    super(desc);
    this.iUpdateDesc(desc);
  }
}
