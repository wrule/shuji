import { ICache } from '../cache';
const cacheMap = new Map<string, string>();

export class LocalCache implements ICache {
  public GetValue(key: string) {
    const result = cacheMap.get(key);
    if (result !== undefined) {
      // return result;
      return null;
    } else {
      return null;
    }
  }

  public SetValue(key: string, value: string) {
    cacheMap.set(key, value);
  }
}
