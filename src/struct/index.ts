import { StructType } from './type';
import { StructUnion } from './union';
import { StructObject } from './object';
import { HashCache } from '../cache/cache/hash';
import { Hash } from '../utils';
import * as MyJSON from '../utils/json';
import { IJsObj } from './IJsObj';
import { cacheCompareRunner, cacheContainRunner } from './cacheRunner';

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

  //#region 结构TsName相关
  /**
   * 用于内部存储实际缓存的TsName结果
   */
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
  //#endregion

  //#region 结构父级结构相关
  /**
   * 内部存储父级结构
   */
  protected parent?: StructObject;

  /**
   * 结构的父级结构(生成代码的时候可提供模块引用信息)
   */
  public get Parent() {
    return this.parent;
  }
  //#endregion

  //#region TypeScript定义代码生成相关
  /**
   * 获取结构的TypeScript定义代码(文本形式)
   */
  public abstract GetTsCode(): string;

  /**
   * 结构的TypeScript定义代码(文本形式)
   */
  public get TsCode() {
    return this.GetTsCode();
  }

  /**
   * 结构的TypeScript定义代码(字符串数组形式)
   */
  public get TsCodeLines() {
    if (this.TsCode.trim() !== '') {
      return this.TsCode.split('\n');
    } else {
      return [];
    }
  }

  /**
   * 可用于测试的TypeScript定义代码(文本形式)
   */
  public get TsTestCode() {
    return `${this.TsCode}\n\nlet a: ${this.TsName} = { } as any;\n`;
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

  /**
   * 判断此结构是否包含目标结构(抽象定义)
   * @param struct 目标结构
   * @returns 是否包含
   */
  protected abstract iContain(struct: Struct): boolean;

  /**
   * 判断此结构是否包含目标结构
   * @param struct 目标结构
   * @returns 是否包含
   */
  public Contain(struct: Struct): boolean {
    // 如果Hash相等,直接视为包含
    if (this.Equal(struct)) {
      return true;
    }
    // 判断逻辑
    let result: boolean;
    if (struct.Type === StructType.Union) {
      const unoin = struct as StructUnion;
      result = unoin.Members.every((struct) => this.Contain(struct));
    } else {
      result = cacheContainRunner(this, struct, this.iContain);
    }
    return result;
  }

  /**
   * 结构相似度对比(抽象定义)
   * @param struct 目标结构
   * @returns [0, 1]区间的值,代表相似度
   */
  protected abstract iCompare(struct: Struct): number;

  /**
   * 结构相似度对比
   * @param struct 目标结构
   * @returns [0, 1]区间的值,代表相似度
   */
  public Compare(struct: Struct): number {
    // 如果Hash相等,相似度为1
    if (this.Equal(struct)) {
      return 1;
    }
    let result: number;
    if (struct.Type === StructType.Union) {
      result = cacheCompareRunner(struct, this, this.iCompare);
    } else {
      result = cacheCompareRunner(this, struct, this.iCompare);
    }
    return result;
  }

  /**
   * 合并两个结构(抽象定义)
   * @param struct 目标结构
   * @returns 合并之后的结构
   */
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

  //#region 结构内容更新方法
  /**
   * 实现更新Desc产生的其他衍生更新(抽象定义)
   * @param desc 
   */
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

  /**
   * 实现更新父级结构产生的其他衍生更新(抽象定义)
   * @param parent 
   */
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
  /**
   * 转换结构为IJsObj类型的JavaScript对象(抽象定义)
   */
  public abstract ToJs(): IJsObj;

  /**
   * 转换结构为Json字符串
   */
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
