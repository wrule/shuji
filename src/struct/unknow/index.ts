import { Struct } from '../index';
import { StructType } from '../type';
import { JsValue } from '../../js/value';
import { Infer } from '../../infer';

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

  protected iUpdate(value: JsValue): Struct {
    return this.Merge(Infer(value));
  }
}
