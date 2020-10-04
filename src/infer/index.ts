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

function InferObject(value: JsValue): Struct {
  return new StructObject(
    new Map(value.ObjectFields.map((field) => [field.Name, Infer(field.Value)]))
  );
}

function InferArray(value: JsValue): Struct {
  if (value.ArrayValues.length > 0) {
    const structs = value.ArrayValues.map((item) => Infer(item));
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
        return new StructTuple(structs);
      } else {
        return new StructArray(result);
      }
    } else {
      return new StructArray(result);
    }
  } else {
    return new StructArray(new StructUnknow());
  }
}

export function Infer(value: JsValue): Struct {
  switch (value.Type) {
    case JsType.Unknow: return new StructUnknow();
    case JsType.Undefined: return new StructUndefined();
    case JsType.Null: return new StructNull();
    case JsType.Boolean: return new StructBoolean();
    case JsType.Number: return  new StructNumber();
    case JsType.String: return new StructString();
    case JsType.Date: return new StructDate();
    case JsType.Object: return InferObject(value);
    case JsType.Array: return InferArray(value);
    default: return new StructUnknow();
  }
}
