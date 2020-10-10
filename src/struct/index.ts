import { StructType } from './type';
import { StructUnion } from './union';
import { StructObject } from './object';

/**
 * 结构抽象类
 */
export abstract class Struct {
  protected hash: string | null = null;

  /**
   * 获取结构Hash(即时计算且缓存)
   */
  public get Hash() {
    if (this.hash === null) {
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

  /**
   * 结构的描述
   */
  public get Desc() {
    return this.desc;
  }

  protected tsName: string = '';

  protected abstract iUpdateTsName(desc: string): void;

  /**
   * 结构在TypeScript中的类型名
   */
  public get TsName(): string {
    return this.tsName;
  }

  protected abstract iUpdateDesc(desc: string): void;

  /**
   * 更新结构的描述
   * 此方法会更新关联的子结构描述以及更新TypeScript类型名
   * @param desc 结构描述
   */
  public UpdateDesc(desc: string) {
    this.desc = desc;
    this.iUpdateDesc(this.desc);
  }


  private ownObjects: StructObject[] | null = null;

  protected abstract iOwnObjects: StructObject[];

  public get OwnObjects() {
    if (!this.ownObjects) {
      this.ownObjects = this.iOwnObjects;
    }
    return this.ownObjects;
  }

  public get SpaceObjects() {
    if (this.Type === StructType.Object) {
      const object = (this as unknown) as StructObject;
      let result: StructObject[] = [];
      Array.from(object.Fields).forEach(([name, struct]) => {
        result.push(...struct.OwnObjects);
      });
      return result;
    } else {
      return this.OwnObjects;
    }
  }

  protected parent?: StructObject;

  public get Parent() {
    return this.parent;
  }

  protected abstract iUpdateParent(parent?: StructObject): void;

  public UpdateParent(parent?: StructObject) {
    this.parent = parent;
    this.iUpdateParent(parent);
  }

  public constructor(
    protected desc: string,
  ) { }
}
