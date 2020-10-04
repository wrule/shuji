import { StructType } from './type';
import { StructUnion } from './union';
import { JsValue } from '../js/value';

/**
 * 结构抽象类
 */
export abstract class Struct {
  protected hash: string = '';

  /**
   * 获取结构Hash(即时计算且缓存)
   */
  public get Hash() {
    if (!this.hash) {
      this.hash = this.CalcHash();
    }
    return this.hash;
  }

  /**
   * 结构的类型
   */
  public abstract Type: StructType;

  /**
   * 结构是否是基础类型
   */
  public abstract IsBasic: boolean;

  /**
   * 计算结构Hash的方法
   */
  protected abstract CalcHash(): string;

  /**
   * 判断两个结构是否完全相等
   * @param ts 目标结构
   * @returns 是否完全相等
   */
  public Equal(ts: Struct) {
    return this.Hash === ts.Hash;
  }

  public Contain(ts: Struct): boolean {
    // 联合前置包含判断
    if (ts.Type === StructType.Union) {
      const unoin = ts as StructUnion;
      return unoin.Members.every((struct) => this.Contain(struct));
    } else {
      return this.iContain(ts);
    }
  }

  /**
   * 判断此结构是否包含目标结构
   * @param ts 目标结构
   * @returns 是否包含
   */
  protected abstract iContain(ts: Struct): boolean;

  public Compare(ts: Struct): number {
    if (ts.Type === StructType.Union) {
      return ts.iCompare(this);
    } else {
      return this.iCompare(ts);
    }
  }

  /**
   * 结构相似度对比
   * @param ts 目标结构
   * @returns [0, 1]区间的值,代表相似度
   */
  protected abstract iCompare(ts: Struct): number;

  public Merge(ts: Struct): Struct {
    // 若完全相等则直接返回
    if (this.Equal(ts)) {
      return this;
    }
    // 若有包含关系则直接返回
    if (this.Contain(ts)) {
      return this;
    }
    if (ts.Contain(this)) {
      return ts;
    }
    // Union前置合并
    if (ts.Type === StructType.Union) {
      return ts.iMerge(this);
    } else {
      return this.iMerge(ts);
    }
  }

  /**
   * 合并两个结构
   * @param ts 目标结构
   * @returns 合并之后的结构
   */
  protected abstract iMerge(ts: Struct): Struct;

  // public Update(value: JsValue): Struct {
  //   return this.iUpdate(value);
  // }

  // protected abstract iUpdate(value: JsValue): Struct;
}
