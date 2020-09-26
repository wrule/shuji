import { JsField } from "../../js/field";
import { TsValue } from "../value";

export class TsField {
  private name: string;
  private value: TsValue;

  public get Name() {
    return this.name;
  }

  public get Hash() {
    return this.value.Hash;
  }

  public constructor(field: JsField) {
    this.name = field.Name;
    this.value = new TsValue(field.Value);
  }
}
