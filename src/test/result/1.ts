export interface IRspAE {
  '_id': string;
  'index': number;
  'guid': string;
  'isActive': boolean;
  'balance': string;
  'picture': string;
  'age': number;
  'eyeColor': string;
  'name': RspAE.IName;
  'company': string;
  'email': string;
  'phone': string;
  'address': string;
  'about': string;
  'registered': string;
  'latitude': string;
  'longitude': string;
  'tags': string[];
  'range': number[];
  'friends': .IFriendsAE[];
  'greeting': string;
  'favoriteFruit': string;
}

export module RspAE {
  export interface IName {
    'first': string;
    'last': string;
  }

  export interface IFriendsAE {
    'id': number;
    'name': string;
  }
}