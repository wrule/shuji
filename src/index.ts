import { Infer } from './infer/index';
import { JsField } from './js/field';

export default class Shuji {
  public Infer(name: string, value: any) {
    const jsField = new JsField(name, value);
    return Infer(jsField.Value, jsField.Name);
  }
}
