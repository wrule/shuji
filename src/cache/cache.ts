
export interface ICache {
  GetValue(key: string): string | null;
  
  SetValue(key: string, value: string): void;
}
