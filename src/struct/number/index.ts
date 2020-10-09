import { Struct } from '../index';
import { StructType } from '../type';
import { StructUnion } from '../union';

export class StructNumber extends Struct {
  public get Type() {
    return StructType.Number;
  }

  public get IsBasic() {
    return true;
  }

  protected CalcHash() {
    return StructType.Number.toString();
  }

  protected iContain(ts: Struct): boolean {
    return this.Equal(ts);
  }

  protected iCompare(ts: Struct): number {
    return this.Equal(ts) ? 1 : 0;
  }

  protected iMerge(ts: Struct): Struct {
    return new StructUnion([this, ts], this.Name);
  }

  public get iOwnObjects() {
    return [];
  }

  protected iUpdateName(name: string) {
    this.tsName = 'number';
  }

  public constructor(name: string) {
    super(name);
    this.iUpdateName(name);
  }
}
