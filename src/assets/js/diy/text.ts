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
    fontSize: '',
    textAlign: '',
  })) {
    Vue.set(this, 'style', JSON.parse(JSON.stringify(this.styleDefault)));
  }

  // let config = {}
  // Vue.set(this, 'config', config)
}

function setAttrData() {
  const data = {
    title: '文字设置',
    content: [
      {
        type: 'input',
        text: '文本内容',
        inputType: 'textarea',
        editType: 'value',
        editKey: 'content',
        model: this.value.content,
        editCB: item => item.model,
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
            value: '18',
          },
          {
            label: '中',
            value: '14',
          },
          {
            label: '小',
            value: '12',
          },
        ],
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
        type: 'radio',
        text: '对齐方式',
        editType: 'style',
        editKey: 'textAlign',
        model: this.style.textAlign,
        value: [
          {
            label: '左',
            value: 'left',
          },
          {
            label: '中',
            value: 'center',
          },
          {
            label: '右',
            value: 'right',
          },
        ],
      },
      {
        type: 'setlink',
        text: '跳转链接',
        editType: 'value',
        editKey: 'link',
        model: this.value,
        bindLinkCB:(dataType, type, path, tooltip, dataItem,pageEl,idx2)=>{

          console.log(dataType, type, path, tooltip, dataItem,pageEl,idx2)
          pageEl.bindLinkDialogShow = false;

          Vue.set(this.value,'link',path);
          Vue.set(this.value,'linkType',type);
          Vue.set(this.value,'tooltip',tooltip);
          //
          this.setIndex(0, { config: false, value: false });
          // // 都是改写vuex里面的数据，两种写法都可以
          this.vm.$store.commit('attrData', this.attrData);// 传出去
          this.vm.$store.state.activeAttr.value = this.value;

        },
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
class Hr extends Common {
  tag = 'text';
  // activeIndex = 0;

  style = {
    color: '',
    bgColor: '',
    fontSize: '',
    textAlign: '',
  }

  styleDefault = {
    color: '#333',
    bgColor: '#e6e6e6',
    fontSize: '14',
    textAlign: 'left',
  }

  config = {

  }


  value ={
    link: '',
    linkType:'',
    tooltip:'',
    content: '这是一行文字',
  }


  constructor(vm) {
    super();

    this.vmObj = vm;

    // 统一这样来初始化
    attrData.call(this);
  }

  // value = []


  setIndex(index: Number, options: Object) {
    this.activeIndex = index;
    attrData.call(this, options);
  }
}

export default Hr;
