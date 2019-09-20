import Vue from 'vue';

function $(el) {
  return document.querySelectorAll(el)
}

export const getStyle = function (el, name) {
  return window.getComputedStyle(el, null)[name]
}


// 会修改原数据
function addFun(object, newobj) {
  for (let key in object) {
    if (!object.hasOwnProperty(key)) continue

    if (typeof object[key] === 'object') {
      if (!newobj) continue
      addFun(object[key], newobj[key])
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
/**
 *
 * @param current
 * @param newObj
 * @param strict 开启严格模式，模板值为false不copy
 */
function mergeDate(current, newObj,strict) {
  for (let key in newObj) {
    if (!newObj.hasOwnProperty(key)) continue
    if(strict && !newObj[key])continue

    if (typeof newObj[key] === 'object') {
      if (!current[key]) {
        Vue.set(current, key, newObj[key])
        continue
      }
      mergeDate(current[key], newObj[key])
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


export function deepCopy(currentObj, newObject) {
  addFun(currentObj, newObject)
  mergeDate(currentObj, newObject)
  return currentObj
}


export function deepCopyStrict(currentObj, newObject) {
  addFun(currentObj, newObject,1)
  mergeDate(currentObj, newObject,1)
  return currentObj
}


var sortEl
var pageMoveArr = {}

export class pageMove {
  static init(dragEl, vm, cb) {
    pageMove.x = 0
    pageMove.y = 0
    pageMove.isDown = false
    pageMove.canvas = $('.canvas')[0]

    pageMove.downX = 0
    pageMove.downY = 0
    pageMove.dragObj = null

    pageMove.leftMenuMainX = 0
    pageMove.pageContentScrollX = 0
    pageMove.canvasPageX = $('.canvas')[0].offsetLeft
    pageMove.pageOffsetX = pageMove.canvasPageX - pageMove.pageContentScrollX + pageMove.leftMenuMainX

    pageMove.canvasPageY = $('.canvas')[0].offsetTop
    pageMove.pageContentScrollY = 0
    pageMove.headerHeight = parseInt(
      getStyle($('header.mainHeader')[0], 'height')
    )
    pageMove.pageOffsetY = pageMove.canvasPageY - pageMove.pageContentScrollY + pageMove.headerHeight

    pageMove.cb = cb

    //sort
    pageMove.beforeOffsetX = 0
    pageMove.beforeOffsetY = 0
    pageMove.sortMiddleArr = []
    pageMove.vm = vm
    pageMove.canvasScrollTop = 0

    pageMove.dragEl = dragEl

    pageMove.getPageScroll()

    if (dragEl === 'sort') return pageMove.initSort()

    pageMove.saveCb(dragEl, cb)
    Array.from(dragEl).map(node => {
      let isSortStatus = node.children[0].className.indexOf('sortStatus') !== -1
      pageMove.dragObj = isSortStatus ? node.children[1] : node.children[0]
    })

    // console.log(pageMove.dragObj)
    Array.from(pageMove.canvas.children).map(el => {
      // if (el.className.indexOf('dragMove') === -1) return
      let elObj = pageMove.dragObj || el

      elObj.removeEventListener('mousedown', pageMove.down, false)
      elObj.addEventListener('mousedown', pageMove.down, false)
    })
  }

  static saveCb(dragEl, cb) {
    let name = dragEl[0].getAttribute('data-name')
    pageMove.cb = cb
    pageMoveArr[name] = {
      cb,
      dom: dragEl[0]
    }
  }

  static down(e) {
    var that = pageMove
    pageMove.parentOffsetTop = this.parentNode.offsetTop
    pageMove.isDown = true
    pageMove.dragObj = this

    pageMove.downX = e.clientX
    pageMove.downY = e.clientY

    if (this.style.position === 'absolute') {
      that.beforeOffsetX = parseInt(getStyle(this, 'left'))
      that.beforeOffsetY = parseInt(getStyle(this, 'top'))
    }

    pageMove.canvas.addEventListener('mousemove', pageMove.mouseMove, false)
    pageMove.canvas.addEventListener(
      'mouseup',
      function () {
        if (!that.dragObj) return
        if (that.dragObj.style.position !== 'absolute') return

        that.beforeOffsetX = that.x
        that.beforeOffsetY = that.y

        pageMove.canvas.removeEventListener(
          'mousemove',
          pageMove.mouseMove
        )
      },
      false
    )
  }

  static mouseMove(e) {
    var that = pageMove
    if (!that.isDown) return

    var el = that.dragObj
    that.x = e.clientX - that.downX + that.beforeOffsetX
    that.y = e.clientY - that.downY + that.beforeOffsetY // - that.parentOffsetTop

    if (el.style.position !== 'absolute') return

    el.style.left = `${that.x}px`
    el.style.top = `${that.y}px`

    try {
      pageMoveArr.input.cb && pageMoveArr.input.cb(that.x, that.y)
    } catch (err) {
      if (globalVal.dragClassName) {
        var cb = pageMoveArr[globalVal.dragClassName].cb
        cb && cb(that.x, that.y)
      }
    }
  }

  static getPageScroll() {
    let that = pageMove
    // $('.pageContent')[0].onscroll = function pageScroll(e) {
    //   let target = e.target || e.srcElement
    //   that.pageContentScrollX = target.scrollLeft
    //   that.pageContentScrollY = target.scrollTop
    //
    //   that.pageOffsetX =
    //     that.canvasPageX - target.scrollLeft + that.leftMenuMainX
    //   that.pageOffsetY =
    //     that.canvasPageY - target.scrollTop + that.headerHeight
    // }
  }

  static initSort() {
    var that = pageMove
    sortEl = document.querySelectorAll('.canvas > section')
    Array.from(sortEl).map(v => {
      v.ondragstart = that.sortStart
      v.ondrag = that.sortDrag
      v.ondragend = that.sortDragend

      v.ondragenter = that.sortDragenter
      v.ondragover = that.sortDragover
      v.ondragleave = that.sortDragleave
    })
  }

  static sortStart() {
    pageMove.sortMiddleArr = Array.from(sortEl).map(
      v => v.offsetTop + parseInt(getStyle(v, 'height')) / 2
    )
    pageMove.canvasScrollTop = pageMove.canvas.scrollTop
  }

  static sortDrag(e) {
    let that = pageMove
    let current =
      e.clientY -
      $('.pageContent')[0].offsetTop +
      pageMove.canvasScrollTop

    // console.log(that.sortMiddleArr)
    let index = -1
    for (let i = 0; i < that.sortMiddleArr.length; i++) {
      let middle = that.sortMiddleArr[i]
      let next = that.sortMiddleArr[i + 1] || middle

      if (current < middle) {
        index = i
        break
      } else if (current > middle && current < next) {
        index = i + 1
      } else if (current > next) {
        index = i + 1
      }
    }

    that.vm.$data.sort.sortIndex = index
  }

  static sortDragend(e) {
    let that = pageMove
    e.preventDefault()
    e.stopPropagation()

    let downIndex = that.vm.$data.sort.downIndex
    let sortIndex = that.vm.$data.sort.sortIndex

    if (downIndex == sortIndex) {
      // console.log('不替换')
    } else {
      if (downIndex != sortIndex && downIndex - sortIndex >= 1) {
        that.sortPage(
          that.vm.$data.templateData[ActiveAttrObj.tabIndex],
          downIndex,
          sortIndex
        )
        that.sortPage(
          that.vm.$data.templateList[ActiveAttrObj.tabIndex],
          downIndex,
          sortIndex
        )
      } else {
        that.sortPage(
          that.vm.$data.templateData[ActiveAttrObj.tabIndex],
          downIndex,
          sortIndex - 1
        )
        that.sortPage(
          that.vm.$data.templateList[ActiveAttrObj.tabIndex],
          downIndex,
          sortIndex - 1
        )
      }
    }

    that.vm.$data.sort.sortIndex = -1
    that.vm.$data.editData.display = 'none'
  }

  static sortPage(data, downIndex, sortIndex) {
    var sort = data.splice(downIndex, 1)
    data.splice(sortIndex, 0, ...sort)
  }

  // sortDragenter(){
  //     console.log('进入范围')
  // }
  // sortDragover(e){
  //     // console.log('对象范围内移动', e)
  // }
  // sortDragleave(){
  //     console.log('离开过程对象的范围')
  //     console.log('\n')
  // }

  static sortDrop(e) {
    e.preventDefault()
    e.stopPropagation()
    // console.log('释放')
  }
}
