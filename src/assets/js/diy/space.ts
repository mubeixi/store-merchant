import Vue from 'vue';
import Common from './commonClass';


function setValue() {
  // let value = {}
  // Vue.set(this, 'value', value)
}

function setConfig() {
  // 如果新对象，那么可以考虑用默认值替换掉。
  if (JSON.stringify(this.style) === JSON.stringify({
    bgColor: '',
    height: '',
  })) {
    Vue.set(this, 'style', JSON.parse(JSON.stringify(this.styleDefault)));
  }
  // let config = {}
}

function setAttrData() {
  const data = {
    title: '辅助间隙设置',
    content: [
      {
        type: 'input',
        text: '高度',
        inputType: 'number',
        editType: 'style',
        editKey: 'height',
        model: this.style.height,
      },
      {
        type: 'color',
        text: '背景颜色',
        model: this.style.bgColor,
        editType: 'style',
        editKey: 'bgColor',
        editCB: item => {
          return item.model?item.model:'none'
        },
      },
    ],
  };


  Vue.set(this, 'attrData', data);
}

function attrData(options = {}) {
  // @ts-ignore
  const {value, config, attrData} = options;
  // console.log(value, config, attrData);
  if (value !== false) setValue.call(this);
  if (config !== false) setConfig.call(this);
  if (attrData !== false) setAttrData.call(this);
}

//
class Space extends Common {
  tag = 'space';
  // activeIndex = 0;

  style = {
    bgColor: '#fff',
    height: '10', // 默认是10吧
  }

  styleDefault = {
    // bgColor: '#fff',
    // height: '10', // 默认是10吧
  }

  config = {}


  constructor() {
    super();

    // 统一这样来初始化
    attrData.call(this);
  }

  // value = []


  setIndex(index: number, options: object) {
    this.activeIndex = index;
    attrData.call(this, options);
  }
}

export default Space;
