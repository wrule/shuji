// import { Infer } from './infer/index';
// import { JsField } from './js/field';
// import object from './test/index2.json';
// import fs from 'fs';

import { mainModule } from "process";

// const jsField = new JsField('me', object);
// const oldTime = Number(new Date());
// const struct = Infer(jsField.Value, 'rsp');
// console.log('耗时', Number(new Date()) - oldTime);
// fs.writeFileSync('output/1.ts', struct.TsTestCode, 'utf8');

// import deasync from 'deasync';
// var cp = require('child_process');

// function asyncFunc(cb: (err: any, res: any) => void) {
//   setTimeout(() => {
//     cb(null, '同步');
//   }, 2000);
// }

// const syncFunc = deasync(asyncFunc);

// async function main() {
//   console.log('start');
//   const result = syncFunc();
//   console.log(result);
// }

// main();

import { SyncRedis } from './utils/syncRedis';

const syncRedis = new SyncRedis();
