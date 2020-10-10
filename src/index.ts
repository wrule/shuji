import { Infer } from './infer/index';
import { JsField } from './js/field';
import { StructObject } from './struct/object';
import object from './test/index2.json';
import API from './namespace/api';
import { IResponse, Response } from './namespace/api2';
import { StructArray } from './struct/array';
import fs from 'fs';

// console.log(API.Response.Object.num);



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
const struct = Infer(jsField.Value, 'rsp');
const tss = struct as StructObject;
console.log('耗时', Number(new Date()) - oldTime);
console.log(struct.Hash);
console.log(tss.TsDef.join('\n'));

// fs.writeFileSync('src/test/result/1.ts', tss.TsDef.join('\n'), 'utf8');

// console.log(tss.SpaceObjects.length);
