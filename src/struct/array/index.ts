import { Struct } from '../index';
import { StructType } from '../type';
import { StructUnion } from '../union';
import { StructTuple } from '../tuple';
import { Hash } from '../../utils';

export class StructArray extends Struct {
  public get ElementStruct() {
    return this.elementStruct;
  }

  public get Type() {
    return StructType.Array;
  }

  public get IsBasic() {
    return false;
  }

  protected CalcHash() {
    return Hash(`${this.ElementStruct.Hash}[]`);
  }

  protected iTsName(name: string) {
    return `${this.ElementStruct.TsName(name)}[]`;
  }

  protected iContain(ts: Struct): boolean {
    if (ts.Type === this.Type) {
      const array = ts as StructArray;
      return this.ElementStruct.Contain(array.ElementStruct);
    } else if (ts.Type === StructType.Tuple) {
      const tuple = ts as StructTuple;
      return tuple.ElementsStruct.every((struct) => this.ElementStruct.Contain(struct));
    } else {
      return false;
    }
  }

  protected iCompare(ts: Struct): number {
    if (ts.Type === this.Type) {
      const array = ts as StructArray;
      return this.ElementStruct.Compare(array.ElementStruct);
    } else {
      return 0;
    }
  }

  protected iMerge(ts: Struct): Struct {
    if (ts.Type === this.Type) {
      const array = ts as StructArray;
      return new StructArray(this.ElementStruct.Merge(array.ElementStruct));
    } else if (ts.Type === StructType.Tuple) {
      const tuple = ts as StructTuple;
      let result = this.ElementStruct;
      tuple.ElementsStruct.forEach((struct) => {
        result = result.Merge(struct);
      });
      return new StructArray(result);
    } else {
      return new StructUnion([this, ts]);
    }
  }

  public get OwnObjects() {
    return this.ElementStruct.OwnObjects;
  }

  public constructor(
    private elementStruct: Struct,
  ) {
    super();
  }
}
