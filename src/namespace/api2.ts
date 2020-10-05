
export interface IResponse {
  success: boolean;
  object: Response.IObject;
  message: string;
}

export module Response {
  export interface IObject {
    name: string;
    age: number;
    meta: Object.IMeta;
  }

  export module Object {
    export interface IMeta {

    }
  }
}
