# Shuji

> 分析Json或JavaScript对象并且生成对应的类型定义以及定义代码

## Features
 * 支持生成数组/元组定义
 * 支持嵌套层级对象定义生成
 * 支持Unoin(联合类型)的定义生成
 * 支持缓存
 * 支持把结构生成Json字符串或从Json字符串读取结构

## How to use

```javascript
const shuji = new Shuji();

let struct = shuji.Infer('desc', 1);
console.log(struct.TsName);
//=> 'number'
```

```javascript
struct = shuji.Infer('desc', 'abc');
console.log(struct.TsName);
//=> 'string'
```

```javascript
struct = shuji.Infer('desc', undefined);
console.log(struct.TsName);
//=> 'undefined'
```

```javascript
struct = shuji.Infer('desc', new Date());
console.log(struct.TsName);
//=> 'Date'
```

```javascript
struct = shuji.Infer('desc', [1, 2, 3]);
console.log(struct.TsName);
//=> 'number[]'
```

```javascript
struct = shuji.Infer('desc', [1, 2, 'abc']);
console.log(struct.TsName);
//=> '[number, number, string]'
```

```javascript
struct = shuji.Infer('student', {
  name: 'jimao',
  age: 18,
});
console.log(struct.TsName);
//=> 'IStudent'
console.log(struct.TsCode);
//=> '[number, number, string]'
//=> export interface IStudent {
//=>  'name': string;
//=>  'age': number;
//=> }
```

```javascript
struct = shuji.Infer('student', [
  { name: 'jimao', age: 18, },
  { name: 'ximao', age: 99, },
]);
console.log(struct.TsName);
//=> 'IStudentAE[]'
console.log(struct.TsCode);
//=> export interface IStudentAE {
//=>   'name': string;
//=>   'age': number;
//=> }
```

```javascript
struct = shuji.Infer('student', [
  { name: 'jimao', age: 18, },
  { name: 'ximao', age: 99, },
  { name: 'kimao' },
]);
console.log(struct.TsName);
//=> 'IStudentAE[]'
console.log(struct.TsCode);
//=> export interface IStudentAE {
//=>   'name': string;
//=>   'age': (number | undefined);
//=> }
```

```javascript
struct = shuji.Infer('student', {
  name: 'jimao',
  age: 18,
  meta: {
    address: 'cn',
    scores: [
      ['math', 98],
      ['english', 65],
    ],
  },
});
console.log(struct.TsName);
//=> 'IStudent'
console.log(struct.TsCode);
//=> export interface IStudent {
//=>   'name': string;
//=>   'age': number;
//=>   'meta': Student.IMeta;
//=> }
//=> 
//=> export module Student {
//=>   export interface IMeta {
//=>     'address': string;
//=>     'scores': [string, number][];
//=>   }
//=> }
```
