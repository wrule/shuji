import { Struct } from '../index';
import { StructType } from '../type';
import { StructObject } from '../object';
import { IJsObj } from '../IJsObj';

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

  protected CalcTsName() {
    return 'any';
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
    return new StructUnknow(jsObj.desc);
  }

  public constructor(desc: string) {
    super(desc);
  }
}
