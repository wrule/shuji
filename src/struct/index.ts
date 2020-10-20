import { StructType } from './type';
import { StructUnion } from './union';
import { StructObject } from './object';
import { ContainCache } from '../cache/cache/contain';
import { CompareCache } from '../cache/cache/compare';
import { HashCache } from '../cache/cache/hash';
import { Hash } from '../utils';
import * as MyJSON from '../utils/json';
import { IJsObj } from './IJsObj';

/**
 * 结构抽象类
 */
export abstract class Struct {
  //#region 结构基本信息相关
  /**
   * 结构的类型(抽象定义)
   */
  public abstract Type: StructType;

  /**
   * 结构是否是基础类型(抽象定义)
   */
  public abstract IsBasic: boolean;

  /**
   * 结构的原始描述
   */
  public get Desc() {
    return this.desc;
  }

  protected tsName?: string;
  
  /**
   * 计算结构TypeScript描述的方法(抽象定义)
   */
  protected abstract CalcTsName(): string;

  /**
   * 可在TypeScript代码中描述此结构的名称(即时计算且缓存)
   */
  public get TsName(): string {
    if (!this.tsName) {
      this.tsName = this.CalcTsName();
    }
    return this.tsName;
  }

  protected parent?: StructObject;

  /**
   * 结构的父级结构(生成代码的时候可提供模块引用信息)
   */
  public get Parent() {
    return this.parent;
  }

  /**
   * 结构TypeScript定义代码(字符串数组形式)
   */
  public abstract iTsCode(): string;

  /**
   * 结构TypeScript定义代码(文本形式)
   */
  public get TsCode() {
    return this.iTsCode();
  }

  public get TsCodeLines() {
    if (this.TsCode.trim() !== '') {
      return this.TsCode.split('\n');
    } else {
      return [];
    }
  }

  /**
   * 可用于测试的代码
   */
  public get TsTestCode() {
    return `${this.TsCode}\n\nlet a: ${this.TsName} = { } as any;\n`;
  }
  //#endregion

  //#region 结构Hash相关
  /**
   * 用于内部存储实际缓存的Hash结果
   */
  protected hash?: string;

  /**
   * 带有缓存功能的Hash计算方法
   * @param text 需要计算Hash的文本
   * @returns 带缓存的Hash结果
   */
  protected cacheHash(text: string): string {
    const hashCache = new HashCache(text);
    const cacheValue = hashCache.Get();
    if (cacheValue !== null) {
      return cacheValue;
    }
    const hash = Hash(text);
    hashCache.Set(hash);
    return hash;
  }

  /**
   * 计算结构Hash的方法(抽象定义)
   */
  protected abstract CalcHash(): string;

  /**
   * 获取结构Hash(即时计算且缓存)
   */
  public get Hash() {
    if (!this.hash) {
      this.hash = this.CalcHash();
    }
    return this.hash;
  }
  //#endregion

  //#region 结构之间的交互方法
  /**
   * 判断两个结构是否完全相等
   * @param struct 目标结构
   * @returns 是否完全相等
   */
  public Equal(struct: Struct) {
    return this.Hash === struct.Hash;
  }

  protected abstract iContain(struct: Struct): boolean;

  /**
   * 判断两个结构的判断包含操作是否需要缓存
   * @param struct1 结构1
   * @param struct2 结构2
   * @returns 是否需要缓存
   */
  private isNeedContainCache(struct1: Struct, struct2: Struct): boolean {
    return (
      (struct1.Type === StructType.Object && (
        struct2.Type === StructType.Object ||
        struct2.Type === StructType.Union
      )) ||
      (struct1.Type === StructType.Array && (
        struct2.Type === StructType.Array ||
        struct2.Type === StructType.Tuple ||
        struct2.Type === StructType.Union
      )) ||
      (struct1.Type === StructType.Tuple && (
        struct2.Type === StructType.Tuple ||
        struct2.Type === StructType.Union
      )) ||
      (struct1.Type === StructType.Union)
    );
  }

  /**
   * Cotain缓存运行器
   * @param struct1 源结构
   * @param struct2 目标结构
   * @param func 需缓存的方法
   * @returns 是否包含
   */
  private cacheContainRunner(
    struct1: Struct,
    struct2: Struct,
    func: (struct: Struct) => boolean,
  ): boolean {
    const containCache = new ContainCache(struct1, struct2);
    const need = this.isNeedContainCache(struct1, struct2);
    if (need) {
      const cacheValue = containCache.Get();
      if (cacheValue !== null) {
        return cacheValue;
      }
    }
    const result = func.call(struct1, struct2);
    if (need) {
      containCache.Set(result);
    }
    return result;
  }

  /**
   * 判断此结构是否包含目标结构
   * @param struct 目标结构
   * @returns 是否包含
   */
  public Contain(struct: Struct): boolean {
    // 如果Hash相等,直接视为包含
    if (this.Hash === struct.Hash) {
      return true;
    }
    // 判断逻辑
    let result: boolean;
    if (struct.Type === StructType.Union) {
      const unoin = struct as StructUnion;
      result = unoin.Members.every((struct) => this.Contain(struct));
    } else {
      result = this.cacheContainRunner(this, struct, this.iContain);
    }
    return result;
  }

  protected abstract iCompare(struct: Struct): number;

  /**
   * 判断两个结构的计算相似度操作是否需要缓存
   * @param struct1 结构1
   * @param struct2 结构2
   * @returns 是否需要缓存
   */
  private isNeedCompareCache(struct1: Struct, struct2: Struct): boolean {
    return (
      (struct1.Type === StructType.Union || struct2.Type === StructType.Union) ||
      ((struct1.Type === struct2.Type) && (!struct1.IsBasic && !struct2.IsBasic))
    );
  }

  /**
   * Compare缓存运行器
   * @param struct 目标结构
   * @param func 需缓存的方法
   * @returns [0, 1]区间的值,代表相似度
   */
  private cacheCompareRunner(
    struct1: Struct,
    struct2: Struct,
    func: (struct: Struct) => number,
  ): number {
    const compareCache = new CompareCache(struct1, struct2);
    const need = this.isNeedCompareCache(struct2, struct2);
    if (need) {
      const cacheValue = compareCache.Get();
      if (cacheValue !== null) {
        return cacheValue;
      }
    }
    const result = func.call(struct1, struct2);
    if (need) {
      compareCache.Set(result);
    }
    return result;
  }

  /**
   * 结构相似度对比
   * @param struct 目标结构
   * @returns [0, 1]区间的值,代表相似度
   */
  public Compare(struct: Struct): number {
    // 如果Hash相等,相似度为1
    if (this.Hash === struct.Hash) {
      return 1;
    }
    let result: number;
    if (struct.Type === StructType.Union) {
      result = this.cacheCompareRunner(struct, this, this.iCompare);
    } else {
      result = this.cacheCompareRunner(this, struct, this.iCompare);
    }
    return result;
  }

  protected abstract iMerge(struct: Struct): Struct;

  /**
   * 合并两个结构
   * @param struct 目标结构
   * @returns 合并之后的结构
   */
  public Merge(struct: Struct): Struct {
    // 若完全相等则直接返回
    if (this.Equal(struct)) {
      return this;
    }
    // 若有包含关系则直接返回
    if (this.Contain(struct)) {
      return this;
    }
    if (struct.Contain(this)) {
      return struct;
    }
    // Union前置合并
    if (struct.Type === StructType.Union) {
      return struct.iMerge(this);
    } else {
      return this.iMerge(struct);
    }
  }
  //#endregion

  //#region 结构基本信息更新方法
  protected abstract iUpdateDesc(desc: string): void;

  /**
   * 更新结构的描述
   * 此方法会更新关联的子结构描述以及更新TsName
   * 此方法产生的需求是因为Array,Tuple,Union的构造函数之中需要更新子结构Desc
   * @param desc 结构描述
   */
  public UpdateDesc(desc: string) {
    this.desc = desc;
    this.iUpdateDesc(this.desc);
  }

  protected abstract iUpdateParent(parent?: StructObject): void;

  /**
   * 更新结构的父级结构
   * @param parent 父级结构
   */
  public UpdateParent(parent?: StructObject) {
    this.parent = parent;
    this.iUpdateParent(parent);
  }
  //#endregion

  //#region 相关对象结构
  private ownObjects?: StructObject[];

  protected abstract iOwnObjects(): StructObject[];

  /**
   * 结构自身携带的对象结构列表(即时计算且缓存)
   * 内部使用,外部不需要使用
   */
  public get OwnObjects() {
    if (!this.ownObjects) {
      this.ownObjects = this.iOwnObjects();
    }
    return this.ownObjects;
  }

  /**
   * 作用域空间内结构携带的对象结构列表
   */
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
  //#endregion

  //#region JSON转换相关
  public abstract ToJs(): IJsObj;

  public Stringify(): any {
    return MyJSON.Stringify(this.ToJs());
  }
  //#endregion

  //#region 构造函数,必须传入描述
  public constructor(
    protected desc: string,
  ) { }
  //#endregion
}
