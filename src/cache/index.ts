import { LocalCache } from './local';
import { RedisCache } from './redis';

// export const Cache = new RedisCache();
export const Cache = new LocalCache();
