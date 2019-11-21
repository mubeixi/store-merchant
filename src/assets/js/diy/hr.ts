import Vue from 'vue';
import Common from './commonClass';


function setValue() {
  // let value = {}
  // Vue.set(this, 'value', value)
}

function setConfig() {
  // 如果新对象，那么可以考虑用默认值替换掉。
  if (JSON.stringify(this.style) === JSON.stringify({
    color: '',
    bgColor: '',
    margin: '',
    height: '',
  })) {
    Vue.set(this, 'style', JSON.parse(JSON.stringify(this.styleDefault)));
  }
  // let config = {}
}

function setAttrData() {
  const data = {
    title: '辅助线设置',
    content: [
      {
        type: 'color',
        text: '线条颜色',
        model: this.style.color,
        editType: 'style',
        editKey: 'color',
        editCB: item => item.model,
        // editCB2: (item) => {
        //   const val = item.model;
        //   if (!val || val.indexOf(',') == -1) return;
        //   const color = val.split(',');
        //
        //   color[3] = `${this.style.transparent.backgroundTransparent / 100})`;
        //
        //   // 颜色要修改下，后面透明度会用到
        //   // this.style.classInput.default['background-color'] = color.store()
        //   return color.store();
        // },
      },
      {
        type: 'radio',
        text: '线条样式',
        editType: 'config',
        editKey: 'type',
        model: this.config.type,
        value: [
          {
            label: '实线',
            value: 'solid',
          },
          {
            label: '虚线',
            value: 'dashed',
          },
        ],
      },
      {
        type: 'input',
        text: '线条高度',
        inputType: 'number',
        editType: 'style',
        editKey: 'height',
        model: this.style.height,
      },

      {
        type: 'input',
        inputType: 'number',
        text: '上下间距',
        editType: 'style',
        editKey: 'margin',
        model: this.style.margin,
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
class Hr extends Common {
  tag = 'hr';
  // activeIndex = 0;

  style = {
    color: '',
    //bgColor: '',
    margin: '',
    height: '',
  }

  styleDefault = {
    color: '#e7e7e7',
    margin: '4',
    height: '1',
  }

  config = {
    type: 'solid',
  }


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

export default Hr;
