import { Infer } from './infer/index';
import { JsField } from './js/field';
import { StructObject } from './struct/object';
import object from './test/index.json';
import API from './namespace/api';

console.log(API.Response.Object.num);



// const object = {
//   name: 'gushi',
//   age: 27,
//   sex: true,
//   address: '浙江省杭州市',
//   meta: {
//     like: ['家人', '健康', '美女'],
//     data: [
//       ['身高', 186],
//       ['体重', 220],
//       ['智商', 120],
//     ],
//   },
// };

// const object = [1, 2, '', '', '', '', ''];

const jsField = new JsField('me', object);

const oldTime = Number(new Date());
const struct = Infer(jsField.Value);
console.log(Number(new Date()) - oldTime);
console.log(struct.Hash);

