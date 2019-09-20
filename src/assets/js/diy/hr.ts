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
    title: '辅助线设置',
    content: [
      {
        type: 'color',
        text: '背景颜色',
        model: this.style.color,
        editType: 'style',
        editKey: 'color',
        editCb: item =>item.model,
        editCb2: (item) => {

          let val = item.model
          if (!val || val.indexOf(',')==-1) return
          let color = val.split(',')

          color[3] = this.style.transparent.backgroundTransparent / 100 + ')'

          //颜色要修改下，后面透明度会用到
          //this.style.classInput.default['background-color'] = color.join()
          return color.join()
        }
      },
      {
        type: 'radio',
        text: '样式',
        editType: 'config',
        editKey: 'type',
        model: this.config.type,

        value: [
          {
            label: '实线',
            value: 'solid'
          },
          {
            label: '虚线',
            value: 'dashed'
          },
        ]
      },
      {
        type: 'input',
        text: '上下间距',
        editType: 'style',
        editKey: 'margin',
        model: this.style.margin,
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


  tag = 'space';
  //activeIndex = 0;

  style = {
    color: '',
    margin:'',
    height:''
  }

  styleDefault = {
    color: '#e7e7e7',
    margin:'4',
    height:'1'
  }

  config = {
    type: 'solid'
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
