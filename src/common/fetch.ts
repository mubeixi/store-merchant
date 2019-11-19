import Vue from 'vue';
import {baseApiUrl} from './env';
import {hexMD5} from "@/common/tool/md5";
import {Loading} from "element-ui";
import {ls} from "@/common/tool/ls";

import Cookie from 'js-cookie';

require('./tool/base64');

window.funLoading = false

const fetch = function (act: String, param: Object = {}, options = false, url: String = '/api/little_program/shopconfig.php', method: String = 'post') {

  console.log(param)
  if (!act) Vue.$fun.warning('获取信息失败');

  // @ts-ignore
  param.act = act;

  param.env = 'wx_mp';
  // param.Users_Account = get_Users_Account();
  // @ts-ignore
  param.Users_ID = get_Users_ID();
  // param.appid = get_Appid();

  // 数据加密
  let data = createToken(param);

  url = (process.env.NODE_ENV === 'production' ? baseApiUrl : '') + url;
  console.log(url, param);

  if (options) {
    window.funLoading = Loading.service(options)
  }

  return new Promise(((resolve, reject) => {

    Vue.http[method](url, data, options).then(res=>{
      resolve(res.data)
    },error=>{
      reject(error)
    })

  }));

};


export const login = (data:object={},options:object={}) => fetch('users_login', data, options)

export const getCouponList = (data:object={},options:object={}) => fetch('get_unaccalimed_coupon', data, options)

export const getProductList = (data:object={},options:object={}) => fetch('get_prod', data, options)

export const getShopSkinList = (data:object={},options:object={}) => fetch('get_shopskin', data, options)

export const chooseShopSkin = (data:object={},options:object={}) => fetch('choose_shopskin', data, options)

//获取商城的配置
//get_shophome
export const getSkinConfig = (data:object={},options:object={}) => fetch('get_skin_data', data, options)

export const getDiySkinConfig = (data:object={},options:object={}) => fetch('get_makeup_home_data', data, options)


//获取自定义页面的列表
export const getDiyPageList = (data:object={},options:object={}) => fetch('get_makeup_home', data, options)

//获取自定义URL列表
export const getDiyUlrList = (data:object={},options:object={}) => fetch('get_makeup_home', data, options)

//获取系统url列表
export const getSystemUrl = (data:object={},options:object={}) => fetch('system_url', data, options)

//获取diy url列表
export const getDiyUrl = (data:object={},options:object={}) => fetch('system_diy_url', data, options)

//更新商城的配置
//update_shophome
export const setSkinConfig = (data:object={},options:object={}) => fetch('save_skin_date', data, options)

export const setDiySkinConfig = (data:object={},options:object={}) => fetch('save_makeup_home_data', data, options)

//秒杀列表
export const getFlashSaleList = (data:object={},options:object={}) => fetch('get_flashsale', data, options)

//获取限时抢购
export const getSpikeList = (data:object={},options:object={}) => fetch('get_spike_list', data, options)

export const getSpikeProd = (data:object={},options:object={}) => fetch('get_spike_prod', data, options)

export const getProductCategory = (data:object={},options:object={}) => fetch('pro_cate', data, options)

export const getUsersInfo = (data:object={},options:object={}) => fetch('get_users_info', data, options)

export const getProductCountInfo  = (data:object={},options:object={}) => fetch('get_users_info', data, options);

export const uploadImgByBase64 = (data:object={},options:object={}) => fetch('upload_image', data, options);

export const getSysuser = (data:object={},options:object={}) => fetch('get_sysuser', data, options);
export const getSysorders = (data:object={},options:object={}) => fetch('get_sysorders', data, options);
export const getSysgrowths = (data:object={},options:object={}) => fetch('get_sysgrowths', data, options);
export const getSysbalances = (data:object={},options:object={}) => fetch('get_sysbalances', data, options);
export const getSysintegrals = (data:object={},options:object={}) => fetch('get_sysintegrals', data, options);
export const getSysloginLogs = (data:object={},options:object={}) => fetch('get_syslogin_logs', data, options);
export const getSysstatistics = (data:object={},options:object={}) => fetch('get_sysstatistics', data, options);
export const getAddress = (data:object={},options:object={}) => fetch('get_address',data,options);
export const getStoreList = (data:object={},options:object={}) => fetch('get_store_list', data, options);

//产品添加编辑所需配置
export const systemProdConfig = (data:object={},options:object={}) => fetch('system_prod_config', data, options);
//产品添加
export const systemOperateProd = (data:object={},options:object={}) => fetch('system_operate_prod', data, options);
//获取产品具体信息
export const systemProdDetail = (data:object={},options:object={}) => fetch('system_prod_detail', data, options);
//获取卡密列表
export const virtualCardList = (data:object={},options:object={}) => fetch('virtual_card_list', data, options);

//获取卡密类型
export const virtualCardType = (data:object={},options:object={}) => fetch('virtual_card_type', data, options);



function get_Appid() {
  return 'xhh';
}

export const get_Users_ID = () => Cookie.get('Users_ID');//ls.get('Users_ID')

export const get_Users_Account = () => ls.get('Users_Account')

export const createToken = function (object) {
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
        ObjectToArr(object[i], newkey);
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
      arrs += ObjectToString(object[i], arrs);
    }
  }
  return arrs;
}
