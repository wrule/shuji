/**
 * 包装JSON序列化方法
 * @param obj 需要序列化的对象
 * @returns 序列化之后的JSON字符串
 */
export function Stringify(obj: any) {
  return JSON.stringify(obj, null, 2);
}

/**
 * 包装JSON反序列化方法
 * @param json JSON字符串
 * @returns 反序列化得到的对象
 */
export function Parse(json: string) {
  return JSON.parse(json);
}
