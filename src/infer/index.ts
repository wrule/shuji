import { JsValue } from '../js/value';
import { Struct } from '../struct';
import { JsType } from '../js/type';
import { StructUnknow } from '../struct/unknow';
import { StructUndefined } from '../struct/undefined';
import { StructUnion } from '../struct/union';
import { StructNull } from '../struct/null';
import { StructBoolean } from '../struct/boolean';
import { StructNumber } from '../struct/number';
import { StructString } from '../struct/string';
import { StructDate } from '../struct/date';
import { StructObject } from '../struct/object';
import { StructArray } from '../struct/array';
import { StructType } from '../struct/type';
import { StructTuple } from '../struct/tuple';

function InferObject(value: JsValue, desc: string): Struct {
  return new StructObject(
    new Map(value.ObjectFields.map((field) => [field.Name, Infer(field.Value, field.Name)])),
    desc,
  );
}

function InferArray(value: JsValue, desc: string): Struct {
  if (value.ArrayValues.length > 0) {
    const structs = value.ArrayValues.map((item, index) => Infer(item, ''));
    // 尝试合并所有元素
    let result = structs[0];
    structs.slice(1).forEach((struct) => {
      result = result.Merge(struct);
    });
    // 如果合并出来的结果是联合结构
    if (result.Type === StructType.Union) {
      const union = result as StructUnion;
      const structCount = union.Members.length;
      const arrayLength = value.ArrayValues.length;
      // Tuple或Array的阈值界限
      if (arrayLength / structCount <= 3) {
        return new StructTuple(structs, desc);
      } else {
        return new StructArray(result, desc);
      }
    } else {
      return new StructArray(result, desc);
    }
  } else {
    return new StructArray(new StructUnknow(''), desc);
  }
}

export function Infer(value: JsValue, desc: string): Struct {
  switch (value.Type) {
    case JsType.Unknow: return new StructUnknow(desc);
    case JsType.Undefined: return new StructUndefined(desc);
    case JsType.Null: return new StructNull(desc);
    case JsType.Boolean: return new StructBoolean(desc);
    case JsType.Number: return  new StructNumber(desc);
    case JsType.String: return new StructString(desc);
    case JsType.Date: return new StructDate(desc);
    case JsType.Object: return InferObject(value, desc);
    case JsType.Array: return InferArray(value, desc);
    default: return new StructUnknow(desc);
  }
}
