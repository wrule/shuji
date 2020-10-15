import { ICache } from '..';
const cacheMap = new Map<string, any>();

export class LocalCache implements ICache {
  public async GetValue(key: string) {
    const result = cacheMap.get(key);
    if (result !== undefined) {
      return result;
    } else {
      return null;
    }
  }

  public async SetValue(key: string, value: any) {
    await cacheMap.set(key, value);
  }
}
