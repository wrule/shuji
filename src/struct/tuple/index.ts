import { Struct } from '../index';
import { StructType } from '../type';
import { StructUnion } from '../union';
import { StructArray } from '../array';
import { StructUndefined } from '../undefined';

export class StructTuple extends Struct {
  private get ElementsStruct() {
    return this.elementsStruct;
  }

  public get Type() {
    return StructType.Tuple;
  }

  public get Hash() {
    return StructType.Tuple.toString();
  }

  public get IsBasic() {
    return false;
  }

  public Equal(ts: Struct) {
    return this.Hash === ts.Hash;
  }

  // TODO Array怎么做
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

  // TODO Array怎么做
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
    } else if (ts.Type === StructType.Array) {
      const array = ts as StructArray;
      let sum = 0;
      this.ElementsStruct.forEach((struct) => {
        sum += struct.Compare(array.ElementStruct);
      });
      return sum /= this.ElementsStruct.length;
    } else {
      return 0;
    }
  }

  // TODO Tuple和Array变换的过程之中是否存在跨类型优化
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
    } else if (ts.Type === StructType.Array) {
      const array = ts as StructArray;
      return new StructTuple(
        this.ElementsStruct.map((struct) => struct.Merge(array.ElementStruct))
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
