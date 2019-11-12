// @ts-nocheck

import Vue from 'vue';
import {staticUrl} from "@/common/env";



export const getStyle = function (el, name) {
  return window.getComputedStyle(el, null)[name];
};

export const domain = (url) => {
  if (!url) return '';
  if (url.indexOf('http') == -1) return staticUrl + url;
  return url;
}

/**
 *
 * @param {*} str
 * @param {*} name
 */
export const GetQueryByString = (str, name) => {
  //获取？号出现几次
  var tempArr = str.split('?');
  // console.log(tempArr)
  // //如果大于1
  if (tempArr.length - 1 > 1) {
    var rt = null;
    for (var i in tempArr) {
      var s = tempArr[i]
      var reg1 = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
      var r1 = s.match(reg1); //匹配目标参数
      if (r1 != null) {
        rt = decodeURIComponent(r1[2]);//一直覆盖，要最后的就行了
      }
    }

    return rt
  }

  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
  if (!str.split("?")[1]) return null;
  var r = str.split("?")[1].match(reg); //匹配目标参数
  // console.log(r)
  if (r != null) {
    return decodeURIComponent(r[2]);

  }
  return ''; //返回参数值

}





/**
 * 深拷贝.
 * @param targetObj
 * @param tmplObj
 * @param cover
 *
 * 一般来说，无脑深拷贝就行了
 *
 * 有几个特殊情况
 * 1.如果targetObj有的属性，但是tempObj没有（是没有，即该属性为undefined，而不是值为false/或者0和null之类，则什么都不用做
 * 2.无脑复制，仅限于value中的list属性
 *
 *
 *
 */
export const mergeObject = function (targetObj,tmplObj) {

  for(var key in tmplObj){
    if(!tmplObj.hasOwnProperty(key))continue;
    //只覆盖着和么多
    if(['value','style','config'].indexOf(key)!=-1){
      Vue.set(targetObj,key,objTranslate(tmplObj[key]))
    }

  }
}

export const objTranslate = obj=>JSON.parse(JSON.stringify(obj))

/**
 * 深拷贝，解决引用的问题。
 * @param currentObj
 * @param newObject
 *
 * 不过很奇怪之前的人为什么要复制两遍
 */
export function deepCopy(currentObj, newObject) {
  // addFun_base(currentObj, newObject)
  // mergeDate_base(currentObj, newObject)
  mergeObject(currentObj, newObject);//方法则是保留本地的新建实例  new Search()这样
  // mergeObject(currentObj, newObject)

  // @ts-ignore
  // mergeData(currentObj, newObject);
  return currentObj;
}

export function mixinStyle(defaultStyle, style) {
  if(!defaultStyle)defaultStyle={};
  if(!style)style={};

  let rt = objTranslate(defaultStyle)
  for(var i in style){
    if(!style.hasOwnProperty(i))continue;
    rt[i] = style[i]

  }
  return rt;
}



export function deepCopyStrict(currentObj, newObject) {
  addFun_base(currentObj, newObject);
  mergeDate_base(currentObj, newObject);
  return currentObj;
}


// 会修改原数据
function addFun_base(object, newobj) {
  for (let key in object) {
    if (!object.hasOwnProperty(key)) continue

    if (typeof object[key] === 'object') {
      if (!newobj) continue
      addFun_base(object[key], newobj[key])
    } else if (typeof object[key] === 'function') {
      continue
    } else {
      if (!newobj || !newobj[key]) continue
      Vue.set(object, key, newobj[key])
    }
  }
}

// 会修改原数据
//浅拷贝对象。。
function mergeDate_base(current, newObj) {
  for (let key in newObj) {
    if (!newObj.hasOwnProperty(key)) continue

    if (typeof newObj[key] === 'object') {
      if (!current[key]) {
        Vue.set(current, key, newObj[key])
        continue
      }
      mergeDate_base(current[key], newObj[key])
    } else {
      if (!current) {
        current = newObj
        continue
      }
      if (!current[key]) {
        Vue.set(current, key, newObj[key])
        continue
      }
      Vue.set(current, key, newObj[key])
    }
  }
}


function defaultEvent (e) {
  e.preventDefault()
}


function isNum(value) {
  return typeof value === 'number' && !isNaN(value);
}

export const arrayUnique = (arr)=>{
  var res=[];
  for(var i=0,len=arr.length;i<len;i++){
    var obj = arr[i];
    for(var j=0,jlen = res.length;j<jlen;j++){
      if(res[j]===obj) break;
    }
    if(jlen===j)res.push(obj);
  }
  return res;
}


export const serialize = obj=>{
  var ary = [];
  for (var p in obj)
    if (obj.hasOwnProperty(p) && (obj[p] || obj[p]== 0 || obj[p] =='' )) {
      ary.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
    }
  return ary.join('&');
};
