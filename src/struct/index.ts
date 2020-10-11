import { StructType } from './type';
import { StructUnion } from './union';
import { StructObject } from './object';

/**
 * 结构抽象类
 */
export abstract class Struct {
  //#region 结构基本信息
  /**
   * 结构的类型(抽象定义)
   */
  public abstract Type: StructType;

  /**
   * 结构是否是基础类型(抽象定义)
   */
  public abstract IsBasic: boolean;

  protected hash?: string;

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

  /**
   * 结构的原始描述
   */
  public get Desc() {
    return this.desc;
  }

  protected tsName: string = '';
  
  /**
   * 可在TypeScript代码中描述此结构的名称
   */
  public get TsName(): string {
    return this.tsName;
  }

  protected parent?: StructObject;

  /**
   * 结构的父级结构(生成代码的时候可提供模块引用信息)
   */
  public get Parent() {
    return this.parent;
  }

  public abstract TsDef(): string[];

  /**
   * 结构TypeScript定义代码
   */
  public get TsCode() {
    return this.TsDef().join('\n');
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
   * 判断此结构是否包含目标结构
   * @param struct 目标结构
   * @returns 是否包含
   */
  public Contain(struct: Struct): boolean {
    // 联合前置包含判断
    if (struct.Type === StructType.Union) {
      const unoin = struct as StructUnion;
      return unoin.Members.every((struct) => this.Contain(struct));
    } else {
      return this.iContain(struct);
    }
  }

  protected abstract iCompare(struct: Struct): number;

  /**
   * 结构相似度对比
   * @param struct 目标结构
   * @returns [0, 1]区间的值,代表相似度
   */
  public Compare(struct: Struct): number {
    if (struct.Type === StructType.Union) {
      return struct.iCompare(this);
    } else {
      return this.iCompare(struct);
    }
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
    this.iUpdateTsName(desc);
  }

  protected abstract iUpdateParent(parent?: StructObject): void;

  /**
   * 更新结构的父级结构
   * @param parent 父级结构
   */
  public UpdateParent(parent?: StructObject) {
    this.parent = parent;
    this.iUpdateParent(parent);
    this.iUpdateTsName(this.Desc);
  }

  /**
   * 重新计算结构的TsName
   * @param desc 结构描述,只有Object结构需要
   */
  protected abstract iUpdateTsName(desc: string): void;
  //#endregion

  //#region 相关对象结构
  private ownObjects?: StructObject[];

  protected abstract iOwnObjects(): StructObject[];

  /**
   * 结构自身携带的对象结构列表(即时计算且缓存)
   * 内部使用,外部不要使用
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

  public constructor(
    protected desc: string,
  ) { }
}
