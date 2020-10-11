import { Infer } from './infer/index';
import { JsField } from './js/field';
import { StructObject } from './struct/object';
import object from './test/index.json';
import fs from 'fs';

const jsField = new JsField('me', object);

const oldTime = Number(new Date());
const struct = Infer(jsField.Value, 'rsp');
console.log('耗时', Number(new Date()) - oldTime);
console.log(struct.TsDef().join('\n'));

fs.writeFileSync('src/test/result/1.ts', struct.TsDef().join('\n'), 'utf8');
