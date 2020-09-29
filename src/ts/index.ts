import { TsType } from "./type";

export abstract class TS {
  /**
   * 类型
   */
  public abstract Type: TsType;

  /**
   * 是否是基础类型
   */
  public abstract IsBasic: boolean;

  /**
   * 结构Hash
   */
  public abstract StructHash: string;

  /**
   * 判断两个类型是否相等
   * @param ts 目标类型
   */
  public abstract Equal(ts: TS): boolean;

  /**
   * 判断此类型是否包含目标类型
   * @param ts 目标类型
   */
  public abstract Contain(ts: TS): boolean;

  /**
   * 类型相似度对比
   * @param ts 目标类型
   * @returns [0, 1]区间的值,代表相似度
   */
  public abstract Compare(ts: TS): number;

  /**
   * 合并两个类型
   * @param ts 目标类型
   * @returns 合并之后的类型
   */
  public abstract Merge(ts: TS): TS;
}
