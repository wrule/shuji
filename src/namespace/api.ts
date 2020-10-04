namespace API {
  export namespace Response {
    export namespace Object {
      export const num: number = 123;
    }
    export interface IObject {
      name: string;
      age: number;
    }
  }
  export interface IResponse {
    success: boolean;
    object: Response.IObject;
    message: string;
  }
}

export default API;
