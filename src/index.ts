// import { JsField } from "./js/field";
// import { StructField } from "./ts/field";

// const jsObj: any = {
//   name: '小明',
//   age: '233',
//   address: '中国',
// };

// const field = new JsField('ni', jsObj);
// const ts = new StructField(field);

// console.log(ts.Hash);

import { jqgram as jq } from 'jqgram';

var root1 = {
  name: "a",
  children: [
    { name: "b" },
  ]
}

var root2 = {
  name: "a",
  children: [
    { name: "c" },
  ]
}

jq.distance({
  root: root1,
  lfn: function(node: any){ return node.name; },
  cfn: function(node: any){ return node.children; }
}, {
  root: root2,
  lfn: function(node: any){ return node.name; },
  cfn: function(node: any){ return node.children; }
}, {
  p: 2,
  q: 3,
  depth:10,
}, function (result: any) {
  console.log(result.distance);
});

