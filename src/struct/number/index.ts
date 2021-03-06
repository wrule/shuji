import { Struct } from '../index';
import { StructType } from '../type';
import { StructUnion } from '../union';
import { StructObject } from '../object';
import { IJsObj } from '../IJsObj';

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

  protected CalcTsName() {
    return 'number';
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

  public GetTsCode() {
    return '';
  }

  public ToJs(): IJsObj {
    return {
      desc: this.Desc,
      type: this.Type,
    };
  }

  public static FromJs(jsObj: IJsObj) {
    return new StructNumber(jsObj.desc);
  }

  public constructor(desc: string) {
    super(desc);
  }
}
