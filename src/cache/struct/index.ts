const cacheMap = new Map<string, any>();

export function GetValue(key: string) {
  return cacheMap.get(key);
}

export function SetValue(key: string, value: any) {
  return cacheMap.set(key, value);
}

// https://github.com/luin/ioredis 缓存可以使用IO Redis
