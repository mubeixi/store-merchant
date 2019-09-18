import Vue from 'vue';
import {baseApiUrl} from "./env";

const fetch = function(url:String,data:Object,options:Object,method:String){

  if(!data)data={};
  if(!data._ajax)data._ajax=2;


  url = baseApiUrl +url;

  return Vue.http[method](url,data,options).then(res=>{
    return res.data;
  },function (e) {
    return e;
  })
}

export const login = (data:Object) => fetch('/user/loginAction',data,{},'post')


