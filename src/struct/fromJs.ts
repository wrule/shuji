import { IJsObj } from './IJsObj';
import { StructUnknow } from './unknow';
import { StructUndefined } from './undefined';
import { StructNull } from './null';
import { StructBoolean } from './boolean';
import { StructNumber } from './number';
import { StructString } from './string';
import { StructDate } from './date';
import { StructArray } from './array';
import { StructTuple } from './tuple';
import { StructType } from './type';
import { StructObject } from './object';
import { StructUnion } from './union';
import { Struct } from '.';
import * as MyJson from '../utils/json';

/**
 * 顶层的构建协调方法
 * 由JavaScript对象根据不同的类型构建对应结构
 * @param jsObj IJsObj类型的JavaScript对象
 * @returns 构建出的结构
 */
export function FromJsHub(jsObj: IJsObj): Struct {
  switch (jsObj.type) {
    case StructType.Undefined: return StructUndefined.FromJs(jsObj);
    case StructType.Null: return StructNull.FromJs(jsObj);
    case StructType.Boolean: return StructBoolean.FromJs(jsObj);
    case StructType.Number: return StructNumber.FromJs(jsObj);
    case StructType.String: return StructString.FromJs(jsObj);
    case StructType.Date: return StructDate.FromJs(jsObj);
    case StructType.Object: return StructObject.FromJs(jsObj);
    case StructType.Array: return StructArray.FromJs(jsObj);
    case StructType.Tuple: return StructTuple.FromJs(jsObj);
    case StructType.Union: return StructUnion.FromJs(jsObj);
    default: return StructUnknow.FromJs(jsObj);
  }
}

/**
 * 由Json字符串构建结构
 * @param json Json字符串
 * @returns 构建出的结构
 */
export function FromJson(json: string): Struct {
  const jsObj = MyJson.Parse(json);
  return FromJsHub(jsObj);
}
