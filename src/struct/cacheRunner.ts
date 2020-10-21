import { Struct } from '.';
import { CompareCache } from '../cache/cache/compare';
import { ContainCache } from '../cache/cache/contain';
import { StructType } from './type';

/**
 * 判断两个结构的判断包含操作是否需要缓存
 * @param struct1 结构1
 * @param struct2 结构2
 * @returns 是否需要缓存
 */
export function isNeedContainCache(struct1: Struct, struct2: Struct): boolean {
  return (
    (struct1.Type === StructType.Object && (
      struct2.Type === StructType.Object ||
      struct2.Type === StructType.Union
    )) ||
    (struct1.Type === StructType.Array && (
      struct2.Type === StructType.Array ||
      struct2.Type === StructType.Tuple ||
      struct2.Type === StructType.Union
    )) ||
    (struct1.Type === StructType.Tuple && (
      struct2.Type === StructType.Tuple ||
      struct2.Type === StructType.Union
    )) ||
    (struct1.Type === StructType.Union)
  );
}

/**
 * Cotain缓存运行器
 * @param struct1 源结构
 * @param struct2 目标结构
 * @param func 需缓存的方法
 * @returns 是否包含
 */
export function cacheContainRunner(
  struct1: Struct,
  struct2: Struct,
  func: (struct: Struct) => boolean,
): boolean {
  const containCache = new ContainCache(struct1, struct2);
  const need = isNeedContainCache(struct1, struct2);
  if (need) {
    const cacheValue = containCache.Get();
    if (cacheValue !== null) {
      return cacheValue;
    }
  }
  const result = func.call(struct1, struct2);
  if (need) {
    containCache.Set(result);
  }
  return result;
}

/**
 * 判断两个结构的计算相似度操作是否需要缓存
 * @param struct1 结构1
 * @param struct2 结构2
 * @returns 是否需要缓存
 */
export function isNeedCompareCache(struct1: Struct, struct2: Struct): boolean {
  return (
    (struct1.Type === StructType.Union || struct2.Type === StructType.Union) ||
    ((struct1.Type === struct2.Type) && (!struct1.IsBasic && !struct2.IsBasic))
  );
}

/**
 * Compare缓存运行器
 * @param struct 目标结构
 * @param func 需缓存的方法
 * @returns [0, 1]区间的值,代表相似度
 */
export function cacheCompareRunner(
  struct1: Struct,
  struct2: Struct,
  func: (struct: Struct) => number,
): number {
  const compareCache = new CompareCache(struct1, struct2);
  const need = isNeedCompareCache(struct2, struct2);
  if (need) {
    const cacheValue = compareCache.Get();
    if (cacheValue !== null) {
      return cacheValue;
    }
  }
  const result = func.call(struct1, struct2);
  if (need) {
    compareCache.Set(result);
  }
  return result;
}
