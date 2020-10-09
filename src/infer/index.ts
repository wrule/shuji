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

function InferObject(value: JsValue, name: string): Struct {
  return new StructObject(
    new Map(value.ObjectFields.map((field) => [field.Name, Infer(field.Value, field.Name)])),
    name,
  );
}

function InferArray(value: JsValue, name: string): Struct {
  if (value.ArrayValues.length > 0) {
    const structs = value.ArrayValues.map((item, index) => Infer(item, `${name}TE${index + 1}`));
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
      if (arrayLength / structCount <= 3) {
        return new StructTuple(structs, name);
      } else {
        return new StructArray(result, name);
      }
    } else {
      return new StructArray(result, name);
    }
  } else {
    return new StructArray(new StructUnknow(''), name);
  }
}

export function Infer(value: JsValue, name: string): Struct {
  switch (value.Type) {
    case JsType.Unknow: return new StructUnknow(name);
    case JsType.Undefined: return new StructUndefined(name);
    case JsType.Null: return new StructNull(name);
    case JsType.Boolean: return new StructBoolean(name);
    case JsType.Number: return  new StructNumber(name);
    case JsType.String: return new StructString(name);
    case JsType.Date: return new StructDate(name);
    case JsType.Object: return InferObject(value, name);
    case JsType.Array: return InferArray(value, name);
    default: return new StructUnknow(name);
  }
}
