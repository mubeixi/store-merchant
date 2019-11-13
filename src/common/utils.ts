// @ts-nocheck
import Vue from 'vue';
import {staticUrl} from "@/common/env";

/**
 * 获取指定的样式值
 * @param el
 * @param name
 */
export const getStyle = function (el, name) {
  return window.getComputedStyle(el, null)[name];
};

/**
 * 给相对路径的图片加上前缀
 * @param url
 */
export const domain = (url) => {
  if (!url) return '';
  if (url.indexOf('http') == -1) return staticUrl + url;
  return url;
}

/**
 *从指定字符串str中获取name=val的val值
 * 一般用于从location.href查找指定的参数
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
 * 对象=>字符串=>对象
 * 一般用于console.log立即显示（有时候虽然在前面打印，但是会由于引用的问题，打印的不是即时结果)
 * 同时可以用于简单粗暴的避免引用传递的对象copy，但是注意这种写法只保留值，会丢失方法
 * @param obj
 */
export const objTranslate = obj=>JSON.parse(JSON.stringify(obj))


/**
 * 限定覆盖指定的值
 * @param targetObj
 * @param tmplObj
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

/**
 * 深拷贝，解决引用的问题。
 * @param currentObj
 * @param newObject
 * 不过很奇怪之前的人为什么要复制两遍
 */
export function deepCopy(currentObj, newObject) {
  mergeObject(currentObj, newObject);//方法则是保留本地的新建实例  new Search()这样
  return currentObj;
}

/**
 * 混合样式
 * @param defaultStyle
 * @param style
 */
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

/**
 * 比较两个对象，并且将模板对象上的值覆盖目标对象
 * @param currentObj
 * @param newObject
 */
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

// 会修改原数据 浅拷贝对象。。
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

/**
 * 是否为Number类型
 * @param value
 */
function isNum(value) {
  return typeof value === 'number' && !isNaN(value);
}

/**
 * 去除数组中的相同元素
 * @param arr
 */
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

/**
 * 请求数组拼接成字符串
 * 可以用在post请求转get,或者拼接url
 * @param obj
 */
export const serialize = obj=>{
  var ary = [];
  for (var p in obj)
    if (obj.hasOwnProperty(p) && (obj[p] || obj[p]== 0 || obj[p] =='' )) {
      ary.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
    }
  return ary.join('&');
};

/**
 * 多维数组的笛卡尔乘积
 * @param array
 */
export const calcDescartes = (array)=>{
  if (array.length < 2) return array[0] || [];
  return [].reduce.call(array, function (col, set) {
    var res = [];
    col.forEach(function (c) {
      set.forEach(function (s) {
        var t = [].concat(Array.isArray(c) ? c : [c]);
        t.push(s);
        res.push(t);
      })
    });
    console.log(res)
    return res;
  });
}
