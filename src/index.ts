import { JsField } from "./js/field";

const jsObj: any = {
  name: '小明',
  age: 27,
  address: '中国',
};

const field = new JsField('ni', jsObj);

console.log(field.SrcValue);
