import { JsValue } from '../value';

/**
 * Js字段
 */
export class JsField {
  private name: string;
  private value: JsValue;

  /**
   * Js字段名称
   */
  public get Name() {
    return this.name;
  }

  /**
   * Js字段值
   */
  public get Value() {
    return this.value;
  }

  public constructor(
    name: string,
    value: any,
  ) {
    this.name = name;
    this.value = new JsValue(value);
  }
}
