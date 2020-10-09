import { Struct } from '../index';
import { StructType } from '../type';

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

  protected iUpdateName(name: string) {
    this.tsName = 'any';
  }

  public constructor(name: string) {
    super(name);
    this.UpdateName(name);
  }
}
