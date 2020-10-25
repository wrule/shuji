export interface IRsp {
  'extParams': Rsp.IExtParams;
  'object': Rsp.IObject;
  'success': boolean;
}

export module Rsp {
  export interface IExtParams {
  
  }

  export interface IObject {
    'apps': Object.IAppsAE[];
    'charset': string;
    'createTime': number;
    'id': string;
    'isStop': number;
    'listUser': Object.IListUserAE[];
    'modifier': Object.IModifier;
    'modifyTime': number;
    'name': string;
    'productBusinessMetas': any[];
    'type': string;
    'userGroups': Object.IUserGroupsAE[];
    'workspaceId': string;
  }
  
  export module Object {
    export interface IAppsAE {
      'id': string;
      'name': string;
    }
  
    export interface IListUserAE {
      'imgUrl': string;
      'nickName': string;
      'uid': string;
    }
  
    export interface IModifier {
      '$ref': string;
    }
  
    export interface IUserGroupsAE {
      'groupId': string;
      'groupName': string;
      'userMetaList': UserGroupsAE.IUserMetaListAE[];
    }
    
    export module UserGroupsAE {
      export interface IUserMetaListAE {
        'imgUrl': string;
        'nickName': string;
        'uid': string;
      }
    }
  }
}

let a: IRsp = { } as any;
