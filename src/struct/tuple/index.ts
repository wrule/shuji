import { Struct } from '../index';
import { StructType } from '../type';
import { StructUnion } from '../union';
import { StructUndefined } from '../undefined';
import { Hash } from '../../utils';

export class StructTuple extends Struct {
  public get ElementsStruct() {
    return this.elementsStruct;
  }

  public get Type() {
    return StructType.Tuple;
  }

  public CalcHash() {
    return Hash(this.ElementsStruct.map((struct) => struct.Hash).join(','));
  }

  public get IsBasic() {
    return false;
  }

  public Equal(ts: Struct) {
    return this.Hash === ts.Hash;
  }

  public Contain(ts: Struct): boolean {
    if (ts.Type === this.Type) {
      const tuple = ts as StructTuple;
      if (this.ElementsStruct.length >= tuple.ElementsStruct.length) {
        return tuple.ElementsStruct
          .every((struct, index) => this.ElementsStruct[index].Contain(struct));
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  public Compare(ts: Struct): number {
    if (ts.Type === this.Type) {
      const tuple = ts as StructTuple;
      const srcCount = this.ElementsStruct.length;
      const dstCount = tuple.ElementsStruct.length;
      const smallStructs = srcCount < dstCount ? this.ElementsStruct : tuple.ElementsStruct;
      const bigStructs = srcCount >= dstCount ? this.ElementsStruct : tuple.ElementsStruct;
      const passRate = smallStructs.length / bigStructs.length;
      let sum = 0;
      smallStructs.forEach((struct, index) => {
        sum += struct.Compare(bigStructs[index]);
      });
      return (sum / smallStructs.length) * passRate;
    } else {
      return 0;
    }
  }

  public Merge(ts: Struct): Struct {
    if (ts.Type === this.Type) {
      const tuple = ts as StructTuple;
      const srcCount = this.ElementsStruct.length;
      const dstCount = tuple.ElementsStruct.length;
      const smallStructs = srcCount < dstCount ? this.ElementsStruct : tuple.ElementsStruct;
      const bigStructs = srcCount >= dstCount ? this.ElementsStruct : tuple.ElementsStruct;
      const undefinedStruct = new StructUndefined();
      return new StructTuple(
        bigStructs.map((struct, index) => {
          const dstStruct = smallStructs[index] || undefinedStruct;
          return struct.Merge(dstStruct);
        })
      );
    } else {
      return new StructUnion([this, ts]);
    }
  }

  public constructor(
    private elementsStruct: Struct[],
  ) {
    super();
  }
}
