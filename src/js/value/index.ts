import { JsType } from '../type';
import { JsField } from '../field';

/**
 * Js值
 */
export class JsValue {
  private type: JsType;
  private objectFields: JsField[] = [];
  private arrayValues: JsValue[] = [];

  /**
   * Js值的类型
   */
  public get Type() {
    return this.type;
  }

  /**
   * Js对象的字段列表
   */
  public get ObjectFields() {
    return this.objectFields;
  }

  /**
   * Js数组的值列表
   */
  public get ArrayValues() {
    return this.arrayValues;
  }

  /**
   * 构造函数
   * @param value Js值
   */
  public constructor(value: any) {
    const protName = Object.prototype.toString.call(value);
    switch (protName) {
      case '[object Undefined]': this.type = JsType.Undefined; break;
      case '[object Null]': this.type = JsType.Null; break;
      case '[object Boolean]': this.type = JsType.Boolean; break;
      case '[object Number]': this.type = JsType.Number; break;
      case '[object String]': this.type = JsType.String; break;
      case '[object Date]': this.type = JsType.Date; break;
      case '[object Object]': {
        this.type = JsType.Object;
        this.objectFields = Object.entries(value)
          .map(([name, fieldValue]) => new JsField(name, fieldValue));
      } break;
      case '[object Array]': {
        this.type = JsType.Array;
        this.arrayValues = (value as any[]).map((item) => new JsValue(item));
      } break;
      default: this.type = JsType.Unknow;
    }
  }
}
