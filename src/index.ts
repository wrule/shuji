import { Infer } from './infer/index';
import { JsField } from './js/field';
import { StructObject } from './struct/object';
import object from './test/index6.json';
import fs from 'fs';
import { StructArray } from './struct/array';

const jsField = new JsField('me', object);

const oldTime = Number(new Date());
const struct = Infer(jsField.Value, 'rsp');
console.log('耗时', Number(new Date()) - oldTime);
// console.log(struct.TsCode);
// console.log(struct.TsName);

fs.writeFileSync('output/1.ts', struct.TsTestCode, 'utf8');

// const friendsArray = ((struct as StructArray).ElementStruct as StructObject).Fields.get('friends') as StructArray;
// console.log(friendsArray.Type);

// 根本原因是访问的是Array的TsName
// 而Array的TsName是被缓存的
// 如果访问数组内部对象的TsName的话就能看到是正确的
