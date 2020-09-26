import { JsType } from '../type';

/**
 * Js值
 */
export class JsValue {
  private type: JsType;
  private value: any;

  /**
   * Js值的类型
   */
  public get Type() {
    return this.type;
  }

  /**
   * Js原始值
   */
  public get Value() {
    return this.value;
  }

  public constructor(value: any) {
    this.type = Object.prototype.toString.call(value) as JsType;
    this.value = value;
  }
}
