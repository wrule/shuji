import { StructType } from './type';

/**
 * 可与Struct交互的JavaScript对象结构
 */
export interface IJsObj {
  desc: string;
  type: StructType;
  fields?: [string, IJsObj][];
  element?: IJsObj;
  elements?: IJsObj[];
  members?: IJsObj[];
}
