import { StructType } from '../struct/type';

export interface IJsObj {
  desc: string;
  type: StructType;
  fields?: [string, IJsObj][];
  element?: IJsObj;
  elements?: IJsObj[];
  members?: IJsObj[];
}
