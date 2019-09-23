import Vue from 'vue';
import { baseApiUrl,apiKey } from './env';
import {hexMD5} from "@/common/tool/md5";
require('./tool/base64');
import {fun} from "@/common/index";
import {Loading} from "element-ui";
import {ls} from "@/common/tool/ls";

window.funLoading = false

const fetch = function (act:String, param:Object={},options = false,url:String='/api/little_program/shopconfig.php',  method:String = 'post') {

  if(!act) Vue.$fun.warning('获取信息失败');

  param.act = act;
  // param.Users_Account = get_Users_Account();
  param.Users_ID = get_Users_ID();
  // param.appid = get_Appid();

  // 数据加密
  let data = createToken(param);

  url = (process.env.NODE_ENV === 'production'?baseApiUrl:'') + url;
  console.log(url,param);

  if(options){
    window.funLoading = Loading.service(options)
  }

  return Vue.http[method](url, data, options).then(res => res.data, e => e);

};


export const login = (data:Object,options) => fetch('users_login', data,options)

export const getCouponList = (data,options) => fetch('get_unaccalimed_coupon',data,options)















function get_Appid() {
  return 'xhh';
}

function get_Users_ID() {
  return ls.get('Users_ID')
}

function get_Users_Account(){
  return ls.get('Users_Account');
}

function createToken(object) {
  object = ObjectToArr(object);
  var signString = ObjectToString(object);
  signString = signString.slice(0, -1);
  var timestamp = parseInt(new Date().getTime() / 1000).toString();
  var key = '458f_$#@$*!fdjisdJDFHUk4%%653154%^@#(FSD#$@0-T';
  var dataStr = signString + key + timestamp;

  var sign = hexMD5(window.Base64.toBase64(dataStr)).toUpperCase();
  object['timestamp'] = timestamp;
  object['sign'] = sign;
  object['sortToken'] = 1;
  return object;
}

//对象转数组，并排序
function ObjectToArr(object, addkey) {
  addkey = addkey || '';
  var arrs = {};
  for (var i in object) {
    var newkey = addkey + (addkey === '' ? i : '[' + i + ']');
    if (typeof object[i] !== 'object') {
      if (object[i] !== '') {
        if (i !== 'timestamp' && i !== 'sign' && i !== 'sortToken') {
          arrs[newkey] = object[i];
        }
      }
    } else {
      this.ObjectToArr(object[i], newkey);
    }
  }
  var newkey_1 = Object.keys(arrs).sort();
  var newObj = {};//创建一个新的对象，用于存放排好序的键值对

  // 此处不能使用for..in
  newkey_1.forEach(function (val) {
    newObj[val] = arrs[val];//向新创建的对象中按照排好的顺序依次增加键值对
  });
  return newObj;
}

//对象转字符串
function ObjectToString(object, arrs) {
  arrs = arrs || '';
  for (var i in object) {
    if (typeof object[i] !== 'object') {
      if (object[i] !== '') {
        if (i !== 'timestamp' && i !== 'sign') {
          arrs += object[i] + ',';
        }
      }
    } else {
      arrs += this.ObjectToString(object[i], arrs);
    }
  }
  return arrs;
}
