import { Infer } from './ts/index';
import { JsField } from './js/field';
import { StructObject } from './struct/object';
import object from './test/index.json';

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

