import { Struct } from '../index';
import { StructType } from '../type';
import { StructUnion } from '../union';
import { StructUndefined } from '../undefined';
import { Hash } from '../../utils';
import { StructObject } from '../object';

export class StructTuple extends Struct {
  public get ElementsStruct() {
    return this.elementsStruct;
  }

  public get Type() {
    return StructType.Tuple;
  }

  public get IsBasic() {
    return false;
  }

  protected CalcHash() {
    return Hash(this.ElementsStruct.map((struct) => struct.Hash).join(','));
  }

  protected iContain(ts: Struct): boolean {
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

  protected iCompare(ts: Struct): number {
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

  protected iMerge(ts: Struct): Struct {
    if (ts.Type === this.Type) {
      const tuple = ts as StructTuple;
      const srcCount = this.ElementsStruct.length;
      const dstCount = tuple.ElementsStruct.length;
      const smallStructs = srcCount < dstCount ? this.ElementsStruct : tuple.ElementsStruct;
      const bigStructs = srcCount >= dstCount ? this.ElementsStruct : tuple.ElementsStruct;
      return new StructTuple(
        bigStructs.map((struct, index) => {
          const undefinedStruct = new StructUndefined(smallStructs[index].Desc);
          const dstStruct = smallStructs[index] || undefinedStruct;
          return struct.Merge(dstStruct);
        }),
        this.Desc,
      );
    } else if (ts.Type === StructType.Array) {
      return ts.Merge(this);
    } else {
      return new StructUnion([this, ts], this.Desc);
    }
  }

  public iOwnObjects() {
    const result: StructObject[] = [];
    this.ElementsStruct.forEach((struct) => {
      result.push(...struct.OwnObjects);
    });
    return result;
  }

  protected iTsName(desc: string) {
    const inner = this.ElementsStruct
      .map((struct) => struct.TsName)
      .join(', ');
    return `[${inner}]`;
  }

  protected iUpdateDesc(desc: string) {
    this.ElementsStruct.forEach((struct, index) => {
      struct.UpdateDesc(`${desc}TE${index + 1}`);
    });
  }

  protected iUpdateParent(parent?: StructObject) {
    this.ElementsStruct.forEach((struct) => {
      struct.UpdateParent(parent);
    });
  }

  public TsDef() {
    let result =
`
${
  this.ElementsStruct
    .map((struct) => struct.TsDef().join('\n'))
    .filter((text) => text.trim())
    .join('\n\n')
}
`;
    return result.trim().split('\n');
  }

  public constructor(
    private elementsStruct: Struct[],
    desc: string,
  ) {
    super(desc);
    this.UpdateDesc(desc);
  }
}
