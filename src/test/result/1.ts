export interface IRsp {
  'extParams': Rsp.IExtParams;
  'object': Rsp.IObjectAE[];
  'success': boolean;
}

export module Rsp {
  export interface IExtParams {
  
  }

  export interface IObjectAE {
    'createTime': number;
    'createTimeStr': string;
    'flag': number;
    'flagStr': string;
    'id': string;
    'runTimes': number;
    'sceneId': string;
  }
}