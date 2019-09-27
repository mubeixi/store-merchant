import Vue from 'vue';
import Common from './commonClass';
import { deepCopy } from '@/common/utils';


function setValue() {
  // let value = {}
  // Vue.set(this, 'value', value)
}

function setConfig() {
  if (JSON.stringify(this.style) === JSON.stringify({
    color: '',
    bgColor: '',
  })) {
    Vue.set(this, 'style', JSON.parse(JSON.stringify(this.styleDefault)));
  }

  // let config = {}
  // Vue.set(this, 'config', config)
}

function setAttrData() {
  const data = {
    title: '标题设置',
    content: [
      {
        type: 'input',
        text: '名称',
        inputType: 'input',
        editType: 'value',
        editKey: 'title',
        model: this.value.title,
        editCB: item => item.model,
      },
      {
        type: 'input',
        text: '副标题',
        inputType: 'input',
        editType: 'value',
        editKey: 'small',
        model: this.value.small,
        editCB: item => item.model,
      },
      {
        type: 'color',
        text: '背景颜色',
        model: this.style.bgColor,
        editType: 'style',
        editKey: 'bgColor',
        editCB: item => item.model,
      },
      {
        type: 'color',
        text: '文字颜色',
        model: this.style.color,
        editType: 'style',
        editKey: 'color',
        editCB: item => item.model,
      },
      {
        type: 'setlink',
        text: '跳转链接',
        editType: 'value',
        editKey: 'link',
        model: this.value.link,
        editCB: item => item.model,
      },

    ],
  };


  Vue.set(this, 'attrData', data);
}

function attrData(options = {}) {
  const { value, config, attrData } = options;
  if (value !== false) setValue.call(this);
  if (config !== false) setConfig.call(this);
  if (attrData !== false) setAttrData.call(this);
}
//
class Title extends Common {
  tag = 'title';
  // activeIndex = 0;

  style = {
    color: '',
    bgColor: '',
  }

  styleDefault = {
    color: '#333',
    bgColor: '#e6e6e6',
  }

  config = {

  }


  value ={
    link: '',
    title: '大标题',
    small: '小标题',
  }


  constructor() {
    super();

    // 统一这样来初始化
    attrData.call(this);
  }

  // value = []

  setIndex(index: Number, options: Object) {
    this.activeIndex = index;
    attrData.call(this, options);
  }
}

export default Title;
