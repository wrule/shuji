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
    return new StructUnion([this, ts], this.Desc);
  }

  public get iOwnObjects() {
    return [];
  }

  protected iUpdateName(name: string) {
    this.tsName = 'Date';
  }

  public constructor(name: string) {
    super(name);
    this.iUpdateName(name);
  }
}
