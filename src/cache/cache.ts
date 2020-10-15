
export interface ICache {
  GetValue(key: string): Promise<any>;
  
  SetValue(key: string, value: any): Promise<void>;
}
