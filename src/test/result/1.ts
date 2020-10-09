export interface IRsp {
  'extParams': IRspMod.IExtParams;
  'object': IRspMod.IObject;
  'success': boolean;
}

export module IRspMod {
  export interface IExtParams {
  
  }

  export interface IObject {
    'actionScriptType': string;
    'allUsers': number;
    'apps': IAppsAE[];
    'creator': IObjectMod.ICreator;
    'machineList': IObjectMod.IMachineList;
    'maxDuration': number;
    'name': string;
    'sceneExecId': string;
    'sceneId': string;
    'sceneScriptConfs': ISceneScriptConfsAE[];
    'sceneStrategyList': ISceneStrategyListAE[];
    'scriptDataFiles': any[];
    'scriptJars': any[];
    'scripts': IScriptsAE[];
    'strategyType': string;
    'unRunnableScripts': IUnRunnableScriptsAE[];
    'userCountKeys': IObjectMod.IUserCountKeys;
  }
  
  export module IObjectMod {
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
      '压力机': I压力机AE[];
    }
    
    export module IMachineListMod {
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
      'tpsPercentModel': IScriptsAEMod.ITpsPercentModel;
      'type': string;
    }
    
    export module IScriptsAEMod {
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