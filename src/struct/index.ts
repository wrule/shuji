import { StructType } from "./type";
import { StructUnion } from "./union";

export abstract class Struct {
  /**
   * 类型
   */
  public abstract Type: StructType;

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
  public abstract Equal(ts: Struct): boolean;

  /**
   * 判断此类型是否包含目标类型
   * @param ts 目标类型
   * @returns 是否包含
   */
  public abstract Contain(ts: Struct): boolean;

  /**
   * 类型相似度对比
   * @param ts 目标类型
   * @returns [0, 1]区间的值,代表相似度
   */
  public abstract Compare(ts: Struct): number;

  /**
   * 合并两个类型
   * @param ts 目标类型
   * @returns 合并之后的类型
   */
  public abstract Merge(ts: Struct): Struct;

  /**
   * 类型更新
   * @param ts 目标类型
   * @returns 更新之后的类型
   */
  public Update(ts: Struct): Struct {
    if (this.Equal(ts)) {
      return this;
    } else {
      if (this.Contain(ts)) {
        return this;
      } else {
        if (this.Compare(ts) > 0.1) {
          return this.Merge(ts);
        } else {
          return new StructUnion([this, ts]);
        }
      }
    }
  }
}
