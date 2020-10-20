import { Struct } from '../index';
import { StructType } from '../type';
import { StructUnion } from '../union';
import { StructObject } from '../object';
import { IJsObj } from '../IJsObj';

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

  protected CalcTsName() {
    return 'boolean';
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

  protected iUpdateDesc(desc: string) { }

  protected iUpdateParent(parent?: StructObject) { }

  public iOwnObjects() {
    return [];
  }

  public iTsCode() {
    return '';
  }

  public ToJs(): IJsObj {
    return {
      desc: this.Desc,
      type: this.Type,
    };
  }

  public static FromJs(jsObj: IJsObj) {
    return new StructBoolean(jsObj.desc);
  }

  public constructor(desc: string) {
    super(desc);
    this.UpdateDesc(desc);
  }
}
