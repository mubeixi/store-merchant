import Common from './commonClass'
import Vue from 'vue'
import {deepCopy} from "@/common/utils";


function setValue() {
  // let value = {}
  // Vue.set(this, 'value', value)
}

function setConfig() {
  // let config = {}
  // Vue.set(this, 'config', config)
}

function setAttrData() {

  let data = {
    title: '文字设置',
    content: [
      {
        type: 'input',
        text: '文本内容',
        inputType:'textarea',
        editType: 'value',
        editKey: 'content',
        model: this.value.content,
        editCb: item =>item.model
      },
      {
        type: 'radio',
        text: '字体大小',
        editType: 'style',
        editKey: 'fontSize',
        model: this.style.fontSize,
        value: [
          {
            label: '大',
            value: '18'
          },
          {
            label: '中',
            value: '14'
          },
          {
            label: '小',
            value: '12'
          }
        ]
      },
      {
        type: 'color',
        text: '背景颜色',
        model: this.style.bgColor,
        editType: 'style',
        editKey: 'bgColor',
        editCb: item =>item.model
      },
      {
        type: 'color',
        text: '文字颜色',
        model: this.style.color,
        editType: 'style',
        editKey: 'color',
        editCb: item =>item.model
      },
      {
        type: 'radio',
        text: '对齐方式',
        editType: 'style',
        editKey: 'textAlign',
        model: this.style.textAlign,
        value: [
          {
            label: '左',
            value: 'left'
          },
          {
            label: '中',
            value: 'center'
          },
          {
            label: '右',
            value: 'right'
          }
        ]
      },
      {
        type: 'setlink',
        text: '跳转链接',
        editType: 'value',
        editKey: 'link',
        model: this.value.link,
        editCb: item =>item.model
      }

    ]
  }


  Vue.set(this, 'attrData', data)
}

function attrData(options = {}) {

  let {value, config, attrData} = options;
  if (value !== false) setValue.call(this);
  if (config !== false) setConfig.call(this);
  if (attrData !== false) setAttrData.call(this);


}
//
class Hr extends Common{


  tag = 'text';
  //activeIndex = 0;

  style = {
    color: '',
    bgColor:'',
    fontSize:'',
    textAlign:'',
  }

  styleDefault = {
    color: '#333',
    bgColor:'#e6e6e6',
    fontSize:'14',
    textAlign:'left',
  }

  config = {

  }


  value ={
    link:'',
    content:'这是一行文字'
  }


  constructor(vm) {


    super()

    this.vmObj = vm

    //统一这样来初始化
    attrData.call(this)


  }

  //value = []


  setIndex(index: Number, options: Object) {
    this.activeIndex = index;
    attrData.call(this, options)
  }
}

export default Hr
