import { TsType } from "./type";

export abstract class TS {
  public abstract Type: TsType;

  public abstract IsBasic: boolean;

  public abstract Compare(ts: TS): number;
}
