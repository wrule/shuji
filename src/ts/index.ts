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

function test(value: JsValue): Struct {
  switch (value.Type) {
    case JsType.Unknow: return new StructUnknow();
    case JsType.Undefined: return new StructUndefined();
    case JsType.Null: return new StructNull();
    case JsType.Boolean: return new StructBoolean();
    case JsType.Number: return  new StructNumber();
    case JsType.String: return new StructString();
    case JsType.Date: return new StructDate();
    case JsType.Object: return new StructObject(
      new Map(value.ObjectFields.map((field) => [field.Name, test(field.Value)]))
    );
    case JsType.Array: {
      const structs = value.ArrayValues.map((item) => test(item));
      let result: Struct;
      if (structs.length > 0) {
        result = structs[0];
        structs.slice(1).forEach((struct) => {
          result = result.Merge(struct);
        });
      } else {
        result = new StructUnknow();
      }
    };
    default: return new StructUnknow();
  }
}