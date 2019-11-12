// @ts-nocheck

import { getStyle } from '../utils'

const $ = el=>document.querySelectorAll(el)

let sortEl
const pageMoveArr = {}

export class pageMove {

  constructor(){

  }

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



    let downIndex=false;
    downIndex = that.vm.$data.sort;// 原来在的位置
    let sortIndex = false;
    sortIndex = that.vm.$data.sort;// 需要被拖动到的位置


    let TARGET = e.target;

    //在这里插入一下拖动搜索框的逻辑
    if(TARGET.className.indexOf('search')>-1 && TARGET.className.indexOf('absolute')>-1){

      //需要更新一下商品
      if(TARGET.id.indexOf('searchWrap')!==-1){
        if(downIndex!==false){
          that.vm.clickPlugin(downIndex)
        }

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

