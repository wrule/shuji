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

  /**
   * Js字段类型
   */
  public get Type() {
    return this.value.Type;
  }

  /**
   * 构造函数
   * @param name Js字段名称
   * @param value Js字段值
   */
  public constructor(
    name: string,
    value: any,
  ) {
    this.name = name;
    this.value = new JsValue(value);
  }
}
