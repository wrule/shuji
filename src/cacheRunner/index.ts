
export class CacheRunner<THIS, ARGS, RESULT> {
  private isNeedCache() {
    return false;
  }

  public Call(args: ARGS): RESULT {
    return { } as any;
  }

  public constructor(
    private that: THIS,
    private method: (args: ARGS) => RESULT,
  ) { }
}
