import { StructType } from './type';
import { StructUnion } from './union';

/**
 * 结构抽象类
 */
export abstract class Struct {
  /**
   * 结构的类型
   */
  public abstract Type: StructType;

  /**
   * 结构是否是基础类型
   */
  public abstract IsBasic: boolean;

  /**
   * 结构Hash
   */
  public abstract Hash: string;

  /**
   * 判断两个结构是否完全相等
   * @param ts 目标结构
   * @returns 是否完全相等
   */
  public abstract Equal(ts: Struct): boolean;

  /**
   * 判断此结构是否包含目标结构
   * @param ts 目标结构
   * @returns 是否包含
   */
  public abstract Contain(ts: Struct): boolean;

  /**
   * 结构相似度对比
   * @param ts 目标结构
   * @returns [0, 1]区间的值,代表相似度
   */
  public abstract Compare(ts: Struct): number;

  /**
   * 合并两个结构
   * @param ts 目标结构
   * @returns 合并之后的结构
   */
  public abstract Merge(ts: Struct): Struct;

  /**
   * 结构更新
   * @param ts 目标结构
   * @returns 更新之后的结构
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
