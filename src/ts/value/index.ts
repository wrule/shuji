import { TsType } from "../type";
import { TsField } from "../field";
import { JsValue } from "../../js/value";
import { JsType } from "../../js/type";
import { Hash } from '../../utils';

export class TsValue {
  private type: TsType;
  private value: JsValue;
  private objectFields: TsField[] = [];
  private arrayValues: TsValue[] = [];
  private hash: string = '';

  public get Type() {
    return this.type;
  }

  public get Hash() {
    return this.hash;
  }

  private arrayHash(values: TsValue[]) {
    return Hash(values.map((item) => item.Hash).join(','));
  }

  private objectHash(fields: TsField[]) {
    return Hash(fields.map((item) => `${item.Name}:${item.Hash}`).join(','));
  }

  public constructor(value: JsValue) {
    this.value = value;
    switch (this.value.Type) {
      case JsType.Undefined: {
        this.type = TsType.Undefined;
        this.hash = TsType.Undefined.toString();
      } break;
      case JsType.Null: {
        this.type = TsType.Null;
        this.hash = TsType.Null.toString();
      } break;
      case JsType.Boolean: {
        this.type = TsType.Boolean;
        this.hash = TsType.Boolean.toString();
      } break;
      case JsType.Number: {
        this.type = TsType.Number;
        this.hash = TsType.Number.toString();
      } break;
      case JsType.String: {
        this.type = TsType.String;
        this.hash = TsType.String.toString();
      } break;
      case JsType.Date: {
        this.type = TsType.Date;
        this.hash = TsType.Date.toString();
      } break;
      case JsType.Object: {
        this.type = TsType.Object;
        // 需要排序,否则Hash计算会不一致
        this.objectFields = this.value.ObjectFields
          .map((item) => new TsField(item))
          .sort((a, b) => a.Name.localeCompare(b.Name));
        this.hash = this.objectHash(this.objectFields);
      } break;
      case JsType.Array: {
        this.type = TsType.Array;
        this.arrayValues = this.value.ArrayValues
          .map((item) => new TsValue(item));
        this.hash = this.arrayHash(this.arrayValues);
      } break;
      default: {
        this.type = TsType.Unknow;
        this.hash = TsType.Unknow.toString();
      }
    }
  }
}
