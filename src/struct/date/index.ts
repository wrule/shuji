import { Struct } from '../index';
import { StructType } from '../type';
import { StructUnion } from '../union';
import { StructObject } from '../object';
import { IJsObj } from '../IJsObj';

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

  protected CalcTsName() {
    return 'Date';
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
    return new StructDate(jsObj.desc);
  }

  public constructor(desc: string) {
    super(desc);
    this.UpdateDesc(desc);
  }
}
