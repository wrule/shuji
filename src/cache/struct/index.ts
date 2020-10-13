const cacheMap = new Map<string, any>();

export function getValue(key: string) {
  return cacheMap.get(key);
}

export function setValue(key: string, value: any) {
  return cacheMap.set(key, value);
}