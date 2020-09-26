import { JsField } from "./js/field";
import { TsField } from "./ts/field";

const jsObj: any = {
  name: '小明',
  age: '233',
  address: '中国',
};

const field = new JsField('ni', jsObj);
const ts = new TsField(field);

console.log(ts.Hash);
