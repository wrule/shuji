export interface IRsp {
  'extParams': Rsp.IExtParams;
  'object': Rsp.IObject;
  'success': boolean;
}

export module Rsp {
  export interface IExtParams {
  
  }

  export interface IObject {
    'actionScriptType': string;
    'allUsers': number;
    'apps': Object.IAppsAE[];
    'creator': Object.ICreator;
    'machineList': Object.IMachineList;
    'maxDuration': number;
    'name': string;
    'sceneExecId': string;
    'sceneId': string;
    'sceneScriptConfs': Object.ISceneScriptConfsAE[];
    'sceneStrategyList': Object.ISceneStrategyListAE[];
    'scriptDataFiles': any[];
    'scriptJars': any[];
    'scripts': Object.IScriptsAE[];
    'strategyType': string;
    'unRunnableScripts': Object.IUnRunnableScriptsAE[];
    'userCountKeys': Object.IUserCountKeys;
  }
  
  export module Object {
    export interface IAppsAE {
      'id': string;
      'name': string;
    }
  
    export interface ICreator {
      'imgUrl': string;
      'nickName': string;
      'uid': string;
    }
  
    export interface IMachineList {
      '压力机': MachineList.I压力机AE[];
    }
    
    export module MachineList {
      export interface I压力机AE {
        'cpuCores': number;
        'diskTotalSize': number;
        'hostName': string;
        'ip': string;
        'machineId': string;
        'memoryTotalSize': number;
        'osName': string;
        'osVersion': string;
        'stateless': boolean;
      }
    }
  
    export interface ISceneScriptConfsAE {
      'createTime': number;
      'id': string;
      'merchantId': string;
      'modifyTime': number;
      'option': string;
      'percent': number;
      'realName': string;
      'runTime': number;
      'runnable': boolean;
      'sceneId': string;
      'scriptId': string;
      'scriptName': string;
      'scriptType': string;
      'users': number;
    }
  
    export interface ISceneStrategyListAE {
      'createTime': number;
      'id': string;
      'index': number;
      'merchantId': string;
      'modifyTime': number;
      'period': number;
      'sceneId': string;
      'userNum': number;
    }
  
    export interface IScriptsAE {
      'createTime': number;
      'fileKey': string;
      'fileSize': string;
      'id': string;
      'isSerialize': boolean;
      'modifyTime': number;
      'name': string;
      'tpsPercentModel': ScriptsAE.ITpsPercentModel;
      'type': string;
    }
    
    export module ScriptsAE {
      export interface ITpsPercentModel {
      
      }
    }
  
    export interface IUnRunnableScriptsAE {
      'id': string;
      'name': string;
    }
  
    export interface IUserCountKeys {
      'dev的trace-mock压测脚本': string;
    }
  }
}