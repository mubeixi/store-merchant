import Vue from 'vue';
import {baseApiUrl} from "@/common/env";
import {fun} from "@/common/index";
import _ from "underscore"

function $(el) {
  return document.querySelectorAll(el);
}

export const getStyle = function (el, name) {
  return window.getComputedStyle(el, null)[name];
};

export const domain = (url) => {
  if (!url) return '';
  if (url.indexOf('http') == -1) return baseApiUrl + url;
  return url;
}


function copyFn(obj) {
  if (obj == null) {
    return null
  }
  var result = Array.isArray(obj) ? [] : {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (typeof obj[key] === 'object') {
        result[key] = copyFn(obj[key]);  // 如果是对象，再次调用该方法自身
      } else {
        result[key] = obj[key];
      }
    }
  }
  return result;
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

// Undefined	"undefined"
// Null	"object" (见下文)
// Boolean	"boolean"
// Number	"number"
// BigInt	"bigint"
// String	"string"
// Symbol (ECMAScript 2015 新增)	"symbol"
// 宿主对象（由 JS 环境提供）	取决于具体实现
// Function 对象 (按照 ECMA-262 规范实现 [[Call]])	"function"
// 其他任何对象 	"object"
export const mergeObject = function (targetObj,tmplObj) {

  //第一遍，搞定targetObj不存在的变量
  // for(var key in tmplObj){
  //
  //   if(!tmplObj.hasOwnProperty(key))continue;
  //
  //   if(_.isUndefined(targetObj[key])){
  //
  //     if(_.isObject(tmplObj[key])){
  //       targetObj[key] = {}
  //     }
  //
  //     if(_.isArray(tmplObj[key])){
  //       targetObj[key] = []
  //     }
  //
  //     //简单值直接复制
  //     targetObj[key] = tmplObj[key];
  //   }
  //
  // }

  for(var key in tmplObj){
    if(!tmplObj.hasOwnProperty(key))continue;


    //只覆盖着和么多
    if(['value','style','config'].indexOf(key)!=-1){
      Vue.set(targetObj,key,objTranslate(tmplObj[key]))
    }

  }

  // for(var key in tmplObj){
  //   if(!tmplObj.hasOwnProperty(key))continue;
  //
  // }


  // return;
  // console.log(targetObj,tmplObj)


  //第一遍，先是覆盖属性。这里如果list是空数组，是不会进循环的
  // for(var key in targetObj){
  //
  //   console.log(key)
  //   //过滤掉属于原型链的方法和属性
  //   if(!targetObj.hasOwnProperty(key))continue;
  //   console.log(key)
  //
  //   console.log(typeof targetObj[key])
  //   //对象、数组，需要过滤null
  //   if (typeof targetObj[key] === 'object' && !_.isNull(targetObj[key])) {
  //
  //     //到这里的不是对象就是数组
  //     if (!tmplObj) continue
  //
  //     //特殊情况，如果是acitveAttr.value.list的话，就无脑覆盖吧.
  //     if(key==='list' && _.isArray(tmplObj[key])){
  //
  //       //数组里面的都是简单值对象，要切断关系。
  //       Vue.set(targetObj, key, tmplObj[key].concat([]));
  //       continue;
  //     }
  //
  //     mergeObject(targetObj[key], tmplObj[key])
  //
  //
  //   } else if (typeof targetObj[key] === 'function') {
  //     continue
  //   } else {
  //
  //     //自己为undefined或者属性为undefined。其他的为0、false/或者空字符串都要继续走
  //     if (_.isUndefined(tmplObj) || _.isUndefined(tmplObj[key])) continue
  //     Vue.set(targetObj, key, tmplObj[key])
  //
  //   }
  //
  //
  // }



  // for(var key in tmplObj){
  //   if(key==='value'){
  //     Vue.set(targetObj,key,tmplObj)
  //   }
  //
  // }

  // _.extend(targetObj,tmplObj);
  // return targetObj
  // for(var key in tmplObj){
  //
  //   // console.log(key,typeof tmplObj[key],targetObj[key],tmplObj[key]);
  //   if (typeof tmplObj[key] === 'object' && tmplObj[key] !== null) {
  //
  //     //current[key] 可能是null或者undefined
  //     if (!targetObj[key]) {
  //       Vue.set(targetObj, key, tmplObj[key]);
  //       continue;
  //     }
  //
  //     // console.log(6666666666666)
  //     // @ts-ignore
  //     mergeObject(targetObj[key], tmplObj[key]);
  //   } else {
  //     // console.log(4444444444444)
  //     // if (!targetObj) {
  //     //   targetObj = tmplObj;
  //     //   continue;
  //     // }
  //
  //     Vue.set(targetObj, key, tmplObj[key]);
  //
  //   }
  //
  //
  // }
  //
  //
  // return obj;
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


let sortEl;
const pageMoveArr = {};

export const moveEl = function (el) {
  let overflow = '';
  console.log(el);
  let [x, y] = [0, 0];
  const title = el.getElementsByClassName('title')[0];
  title.addEventListener('mousedown', down, false);

  window.addEventListener('mouseup', () => {
    document.getElementsByClassName('preview')[0].style.overflow = overflow;
    window.removeEventListener('mousedown', down);
    window.removeEventListener('mousemove', move);
  }, false);

  function down(e) {
    overflow = document.getElementsByClassName('pageContent')[0].style.overflow;
    document.getElementsByClassName('pageContent')[0].style.overflow = 'hidden';

    x = e.clientX - el.offsetLeft;
    y = e.clientY - el.offsetTop;

    window.addEventListener('mousemove', move, false);
  }

  function move(e) {
    el.style.left = `${e.clientX - x}px`;
    el.style.top = `${e.clientY - y}px`;
  }
};

export class pageMove {

  static init(dragEl, vm, cb) {
    pageMove.x = 0;
    pageMove.y = 0;
    pageMove.isDown = false;
    pageMove.canvas = $('.canvas')[0];

    pageMove.downX = 0;
    pageMove.downY = 0;
    pageMove.dragObj = null;

    pageMove.leftMenuMainX = 0;
    pageMove.pageContentScrollX = 0;
    pageMove.canvasPageX = $('.canvas')[0].offsetLeft;
    pageMove.pageOffsetX = pageMove.canvasPageX - pageMove.pageContentScrollX + pageMove.leftMenuMainX;

    pageMove.canvasPageY = $('.canvas')[0].offsetTop;
    pageMove.pageContentScrollY = 0;
    pageMove.headerHeight = 0;// parseInt(getStyle($('header.mainHeader')[0], 'height'))
    pageMove.pageOffsetY = pageMove.canvasPageY - pageMove.pageContentScrollY + pageMove.headerHeight;
    console.log(pageMove.pageOffsetY);
    pageMove.cb = cb;

    // sort
    pageMove.beforeOffsetX = 0;
    pageMove.beforeOffsetY = 0;
    pageMove.sortMiddleArr = [];
    pageMove.vm = vm;
    pageMove.canvasScrollTop = 0;

    pageMove.dragEl = dragEl;

    pageMove.getPageScroll();

    if (dragEl === 'sort') return pageMove.initSort();

    pageMove.saveCB(dragEl, cb);
    Array.from(dragEl).map((node) => {
      const isSortStatus = node.children[0].className.indexOf('sortStatus') !== -1;
      pageMove.dragObj = isSortStatus ? node.children[1] : node.children[0];
    });

    // console.log(pageMove.dragObj)
    Array.from(pageMove.canvas.children).map((el) => {
      // if (el.className.indexOf('dragMove') === -1) return
      const elObj = pageMove.dragObj || el;

      elObj.removeEventListener('mousedown', pageMove.down, false);
      elObj.addEventListener('mousedown', pageMove.down, false);
    });
  }

  static saveCB(dragEl, cb) {
    const name = dragEl[0].getAttribute('data-name');
    pageMove.cb = cb;
    pageMoveArr[name] = {
      cb,
      dom: dragEl[0],
    };
  }

  static down(e) {
    const that = pageMove;
    pageMove.parentOffsetTop = this.parentNode.offsetTop;
    pageMove.isDown = true;
    pageMove.dragObj = this;

    pageMove.downX = e.clientX;
    pageMove.downY = e.clientY;

    if (this.style.position === 'absolute') {
      that.beforeOffsetX = parseInt(getStyle(this, 'left'));
      that.beforeOffsetY = parseInt(getStyle(this, 'top'));
    }

    pageMove.canvas.addEventListener('mousemove', pageMove.mouseMove, false);
    pageMove.canvas.addEventListener(
      'mouseup',
      () => {
        if (!that.dragObj) return;
        if (that.dragObj.style.position !== 'absolute') return;

        that.beforeOffsetX = that.x;
        that.beforeOffsetY = that.y;

        pageMove.canvas.removeEventListener(
          'mousemove',
          pageMove.mouseMove,
        );
      },
      false,
    );
  }

  static mouseMove(e) {
    const that = pageMove;
    if (!that.isDown) return;

    const el = that.dragObj;
    that.x = e.clientX - that.downX + that.beforeOffsetX;
    that.y = e.clientY - that.downY + that.beforeOffsetY; // - that.parentOffsetTop

    if (el.style.position !== 'absolute') return;

    el.style.left = `${that.x}px`;
    el.style.top = `${that.y}px`;

    try {
      pageMoveArr.input.cb && pageMoveArr.input.cb(that.x, that.y);
    } catch (err) {
      if (globalVal.dragClassName) {
        const {cb} = pageMoveArr[globalVal.dragClassName];
        cb && cb(that.x, that.y);
      }
    }
  }

  static getPageScroll() {
    const that = pageMove;
    $('.preview')[0].onscroll = function pageScroll(e) {
      const target = e.target || e.srcElement;
      that.pageContentScrollX = target.scrollLeft;
      that.pageContentScrollY = target.scrollTop;

      that.pageOffsetX = that.canvasPageX - target.scrollLeft + that.leftMenuMainX;
      that.pageOffsetY = that.canvasPageY - target.scrollTop + that.headerHeight;
    };
  }

  static initSort() {
    const that = pageMove;

    //这里只允许搜索框拖拽
    sortEl = document.querySelectorAll('.canvas > section.noborder');
    console.log(sortEl);// 所有的元素，批量添加拖动事件监听
    Array.from(sortEl).map((v) => {
      v.ondragstart = that.sortStart;
      v.ondrag = that.sortDrag;
      v.ondragend = that.sortDragend;

      v.ondragenter = that.sortDragenter;
      v.ondragover = that.sortDragover;
      v.ondragleave = that.sortDragleave;
    });
  }

  static sortStart(e) {
    pageMove.sortMiddleArr = Array.from(sortEl).map(
      v => v.offsetTop + parseInt(getStyle(v, 'height')) / 2,
    );
    pageMove.canvasScrollTop = pageMove.canvas.scrollTop;

    console.log(e)

    // const that = pageMove;
    //
    // const {downIndex} = that.vm.$data.sort;// 原来在的位置
    //
    // let TARGET = e.target;
    //
    // if(TARGET.className.indexOf('search')>-1 && TARGET.className.indexOf('absolute')>-1){
    //
    //   //需要更新一下商品
    //   if(TARGET.id.indexOf('searchWrap')!==-1){
    //     that.vm.clickPlugin(downIndex)
    //   }
    //   return;
    // }


  }

  static sortDrag(e) {

    // console.log(e);

    let TARGET = e.target;

    const sectionEl = document.querySelectorAll('.canvas > section')[0];

    let preBoundingClientRect = sectionEl.getBoundingClientRect()

    //在这里插入一下拖动搜索框的逻辑
    if(TARGET.className.indexOf('search')>-1 && TARGET.className.indexOf('absolute')>-1){
      console.log(e.clientY,pageMove.canvasScrollTop)
      //因为绝对定位只能参照上一层，特别麻烦。
      let TOP = e.clientY-$('.main')[0].offsetTop+(0-preBoundingClientRect.top);
      if(TOP >= 0){
        TARGET.style.top = TOP+'px';
      }
      return;
    }


    const that = pageMove;
    const current = e.clientY - $('.main')[0].offsetTop + pageMove.canvasScrollTop;

    // console.log(that.sortMiddleArr)
    let index = -1;
    for (let i = 0; i < that.sortMiddleArr.length; i++) {
      const middle = that.sortMiddleArr[i];
      const next = that.sortMiddleArr[i + 1] || middle;

      if (current < middle) {
        index = i;
        break;
      } else if (current > middle && current < next) {
        index = i + 1;
      } else if (current > next) {
        index = i + 1;
      }
    }



    that.vm.$data.sort.sortIndex = index;
  }

  static sortDragend(e) {

    const that = pageMove;
    e.preventDefault();
    e.stopPropagation();



    const {downIndex} = that.vm.$data.sort;// 原来在的位置
    const {sortIndex} = that.vm.$data.sort;// 需要被拖动到的位置


    let TARGET = e.target;

    //在这里插入一下拖动搜索框的逻辑
    if(TARGET.className.indexOf('search')>-1 && TARGET.className.indexOf('absolute')>-1){

      //需要更新一下商品
      if(TARGET.id.indexOf('searchWrap')!==-1){
        that.vm.clickPlugin(downIndex)
      }
      return;
    }



    if (downIndex == sortIndex) {
      // console.log('不替换')
    } else {
      // 从下往上移动
      if (downIndex != sortIndex && downIndex - sortIndex >= 1) {
        that.sortPage(
          that.vm.$data.templateData[that.vm.templateEditIndex],
          downIndex,
          sortIndex,
        );
        that.sortPage(
          that.vm.$data.templateList[that.vm.templateEditIndex],
          downIndex,
          sortIndex,
        );
      } else {
        // 从上往下移动
        that.sortPage(
          that.vm.$data.templateData[that.vm.templateEditIndex],
          downIndex,
          sortIndex - 1,
        );
        that.sortPage(
          that.vm.$data.templateList[that.vm.templateEditIndex],
          downIndex,
          sortIndex - 1,
        );
      }
    }

    that.vm.$data.sort.sortIndex = -1;
    that.vm.$data.editData.display = 'none';

  }

  /**
   *
   * @param data  拖动的数据
   * @param downIndex 原来的位置
   * @param sortIndex 需要换到的位置
   */
  static sortPage(data, downIndex, sortIndex) {
    console.log(data, downIndex, sortIndex);
    const sort = data.splice(downIndex, 1);
    data.splice(sortIndex, 0, ...sort);
  }

  sortDragenter() {
    console.log('进入范围');
  }

  sortDragover(e) {
    console.log('对象范围内移动', e);
  }

  sortDragleave() {
    console.log('离开过程对象的范围');
    console.log('\n');
  }

  static sortDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    // console.log('释放')
  }
}

function defaultEvent (e) {
  e.preventDefault()
}


export const moveanyway = (eleId,isAdd) => {

  if(!isAdd){
    document.removeEventListener('touchstart', defaultEvent, {passive: false})
    document.removeEventListener('touchmove', defaultEvent, {passive: false})
    document.removeEventListener('touchend', defaultEvent, {passive: false})
  }

  // 获取节点


  var block = document.getElementById(eleId)

  console.log(block);

  if (block) {

    var oW, oH

    // 绑定touchstart事件

    block.addEventListener('touchstart', function (e) {

      var touches = e.touches[0]

      oW = touches.clientX - block.offsetLeft

      oH = touches.clientY - block.offsetTop

      // 阻止页面的滑动默认事件

      document.addEventListener('touchmove', defaultEvent, {passive: false})

    }, false)


    block.addEventListener('touchmove', function (e) {
      console.log(touches)
      var touches = e.touches[0]

      var oLeft = touches.clientX - oW

      var oTop = touches.clientY - oH

      if (oLeft < 10) {

        oLeft = 10

        if (oTop <= 10) {

          oTop = 10

        } else if (oTop >= document.documentElement.clientHeight - block.offsetHeight - 10) {

          oTop = document.documentElement.clientHeight - block.offsetHeight - 10

        }

      } else if (oLeft > document.documentElement.clientWidth - block.offsetWidth - 10) {

        oLeft = (document.documentElement.clientWidth - block.offsetWidth - 10)

        if (oTop <= 10) {

          oTop = 10

        } else if (oTop >= document.documentElement.clientHeight - block.offsetHeight - 10) {

          oTop = document.documentElement.clientHeight - block.offsetHeight - 10

        }

      } else if (oTop < 10) {

        oTop = 10

      } else if (oTop > document.documentElement.clientHeight - block.offsetHeight - 10) {

        oTop = document.documentElement.clientHeight - block.offsetHeight - 10

      }

      console.log(oLeft,oTop)

      block.style.left = oLeft + 'px'

      block.style.top = oTop + 'px'

    }, false)


    block.addEventListener('touchend', function () {

      document.removeEventListener('touchmove', defaultEvent, {passive: false})

    }, false)

  }


}


function isNum(value) {
  return typeof value === 'number' && !isNaN(value);
}

function getAreaPoint(row_idx, col_idx, row_idx1, col_idx1, scale) {
  return {x: row_idx * scale, y: col_idx * scale, x1: row_idx1 * scale, y1: col_idx1 * scale}
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
