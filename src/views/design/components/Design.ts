import {randLenStr} from "../../../common/utils";
import {fun} from "../../../common";

const getDefaultDom = ()=>{
  return {
    vid:randLenStr(12),
    tag:'img',//text // //qrcode //headimg nickname time //除了img和 text 都是占位，如果是占位的就显示内容，而不允许修改内容（换文字和图片)
    position:{left:0,top:0,zIndex:0},
    //值
    attr:{
      src:'',
      text:''
    },
    style:{
      width:'',//不一定有值
      height:'',//不一定有值
      backgroundColor:'',
      fontSize:''
    }
  }
}

let sortEl

export class Design {

  //渲染
  static init = ({node_list=[],conf})=>{
    console.log(node_list)
  }

  static createNode({tag='text',value=''}){

    let opt:any = {tag}

    if(tag=='img' && !value){
      fun.error({msg:'图片地址缺失'})
      return
    }

    if(tag=='img'){
      opt.attr = {
        src:value
      }
    }

    if(tag=='text' && !value){
      fun.error({msg:'文字不能为空'})
      return
    }

    if(tag=='text'){
      opt.attr = {
        text:value
      }
    }

    const tmplDom = getDefaultDom()
    return Object.assign(tmplDom,opt)

  }

  static initSort() {
    let self = this

    //这里只允许搜索框拖拽
    sortEl = document.querySelectorAll('.mobile > .js-single-dom');
    console.log(sortEl);// 所有的元素，批量添加拖动事件监听
    Array.from(sortEl).map((v:any) => {
      v.ondragstart = self.sortStart;
      v.ondrag = self.sortDrag;
      v.ondragend = self.sortDragend;
      v.ondragenter = self.sortDragenter;
      v.ondragover = self.sortDragover;
      v.ondragleave = self.sortDragleave;
    });
  }

  static sortStart(e) {
    console.log(e)
  }
  static sortDrag(e) {

    let TARGET = e.target;
    const sectionEl = document.querySelectorAll('.canvas > section')[0];

    if(!sectionEl)return;
    let preBoundingClientRect = sectionEl.getBoundingClientRect()

    //在这里插入一下拖动搜索框的逻辑
    // let TOP = e.clientY-$('.main')[0].offsetTop+(0-preBoundingClientRect.top);
    // if(TOP >= 0){
    //   TARGET.style.top = TOP+'px';
    // }
    // return;

  }
  static sortDragend(e) {

  }
  static sortDragenter(e) {

  }
  static sortDragover(e) {

  }
  static sortDragleave(e) {

  }

}
