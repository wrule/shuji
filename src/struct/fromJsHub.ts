import { IJsObj } from './IJsObj';
import { StructUnknow } from './unknow';
import { StructUndefined } from './undefined';
import { StructNull } from './null';
import { StructBoolean } from './boolean';
import { StructNumber } from './number';
import { StructString } from './string';
import { StructDate } from './date';
import { StructArray } from './array';
import { StructTuple } from './tuple';
import { StructType } from './type';
import { StructObject } from './object';
import { StructUnion } from './union';
import { Struct } from '.';

export function FromJsHub(jsObj: IJsObj): Struct {
  switch (jsObj.type) {
    case StructType.Unknow: return StructUnknow.Parse(jsObj);
    case StructType.Undefined: return StructUndefined.Parse(jsObj);
    case StructType.Null: return StructNull.Parse(jsObj);
    case StructType.Boolean: return StructBoolean.Parse(jsObj);
    case StructType.Number: return StructNumber.Parse(jsObj);
    case StructType.String: return StructString.Parse(jsObj);
    case StructType.Date: return StructDate.Parse(jsObj);
    case StructType.Object: return StructObject.Parse(jsObj);
    case StructType.Array: return StructArray.Parse(jsObj);
    case StructType.Tuple: return StructTuple.Parse(jsObj);
    case StructType.Union: return StructUnion.Parse(jsObj);
    default: return StructUnknow.Parse(jsObj);
  }
}
