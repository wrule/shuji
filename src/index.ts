import { Infer } from './infer/index';
import { JsField } from './js/field';
import { StructObject } from './struct/object';
import object from './test/index4.json';
import fs from 'fs';

const jsField = new JsField('me', object);

const oldTime = Number(new Date());
const struct = Infer(jsField.Value, 'rsp');
console.log('耗时', Number(new Date()) - oldTime);
// console.log(struct.TsCode);
// console.log(struct.TsName);

fs.writeFileSync('output/1.ts', struct.TsCode, 'utf8');
