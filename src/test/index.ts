import Shuji from '../index';
import fs from 'fs';
import { Struct } from '../struct';
import { FromJsHub } from '../struct/fromJs';

let dataList: any[] = [];
for (let i = 1; i <= 6; ++i) {
  dataList.push(require(`./index${i}.json`));
}
const shuji = new Shuji();
let struct: Struct = { } as any;
const oldTime = Number(new Date());
dataList.forEach((data) => {
  struct = shuji.Infer('rsp', data);
});
console.log('耗时: ', Number(new Date()) - oldTime);
fs.writeFileSync('output/1.ts', struct.TsTestCode, 'utf8');
const jsObj = struct.ToJs();
const struct2 = FromJsHub(jsObj);
console.log(struct2.Stringify());

// const shuji = new Shuji();

// let struct = shuji.Infer('desc', 1);
// console.log(struct.TsName);

// struct = shuji.Infer('desc', 'abc');
// console.log(struct.TsName);

// struct = shuji.Infer('desc', undefined);
// console.log(struct.TsName);

// struct = shuji.Infer('desc', new Date());
// console.log(struct.TsName);

// struct = shuji.Infer('desc', [1, 2, 3]);
// console.log(struct.TsName);

// struct = shuji.Infer('desc', [1, 2, 'abc']);
// console.log(struct.TsName);

// struct = shuji.Infer('student', {
//   name: 'jimao',
//   age: 18,
// });
// console.log(struct.TsName);
// console.log(struct.TsCode);

// struct = shuji.Infer('student', [
//   { name: 'jimao', age: 18, },
//   { name: 'ximao', age: 99, },
// ]);
// console.log(struct.TsName);
// console.log(struct.TsCode);

// struct = shuji.Infer('student', [
//   { name: 'jimao', age: 18, },
//   { name: 'ximao', age: 99, },
//   { name: 'kimao' },
// ]);
// console.log(struct.TsName);
// console.log(struct.TsCode);

// struct = shuji.Infer('student', {
//   name: 'jimao',
//   age: 18,
//   meta: {
//     address: 'cn',
//     scores: [
//       ['math', 98],
//       ['english', 65],
//     ],
//   },
// });
// console.log(struct.TsName);
// console.log(struct.TsCode);
