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

  protected iTsName() {
    return 'boolean';
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

  public UpdateName(name: string) {
    this.name = name;
  }

  public constructor(name: string) {
    super(name);
  }
}
