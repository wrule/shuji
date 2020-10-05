import { Struct } from "../struct";
import { StructType } from "../struct/type";
import { StructObject } from "../struct/object";
import { StructArray } from "../struct/array";
import { StructUnion } from "../struct/union";
import { StructTuple } from "../struct/tuple";

export function Name(name: string, st: Struct): string {
  switch(st.Type) {
    case StructType.Union: return 'any';
    case StructType.Undefined: return 'undefined';
    case StructType.Null: return 'null';
    case StructType.Boolean: return 'boolean';
    case StructType.Number: return 'number';
    case StructType.String: return 'string';
    case StructType.Date: return 'Date';
    case StructType.Object: return `I${name}`;
    case StructType.Array: return `${Name(name, (st as StructArray).ElementStruct)}[]`;
    case StructType.Tuple: return `[${(st as StructTuple).ElementsStruct.map((st) => ``)}]`;
    case StructType.Union: return 'union';
    default: return 'any';
  }
}
