import { TsType } from "./type";
import { TsUnion } from "./union";

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
   * 判断两个类型是否完全相等
   * @param ts 目标类型
   * @returns 是否完全相等
   */
  public abstract Equal(ts: TS): boolean;

  /**
   * 判断此类型是否包含目标类型
   * @param ts 目标类型
   * @returns 是否包含
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

  /**
   * 类型更新
   * @param ts 目标类型
   * @returns 更新之后的类型
   */
  public Update(ts: TS): TS {
    if (this.Equal(ts)) {
      return this;
    } else {
      if (this.Contain(ts)) {
        return this;
      } else {
        if (this.Compare(ts) > 0.1) {
          return this.Merge(ts);
        } else {
          return new TsUnion([this, ts]);
        }
      }
    }
  }
}
