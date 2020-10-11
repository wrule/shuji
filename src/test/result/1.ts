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

export interface Call {

}

export default function Call(req: any): IRsp {
  return {} as any;
}

import axios from 'axios';



axios.post('', {}, { params: {} });

axios.put('', {}, { params: {} });

axios.patch('', {}, { params: {} });

axios.get('', { params: {} });

axios.options('', { params: {} });

axios.head('', { params: {} })

axios.delete('', { params: {} })

function a(params: any, query: any) {

}

function b(query: any) {

}
