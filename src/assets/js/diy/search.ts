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
    height: 30,
    color: '',
    inputBgColor: '',
    position:'inherit',
    x:0,
    y:0
  })) {
    Vue.set(this, 'style', JSON.parse(JSON.stringify(this.styleDefault)));
  }
  // let config = {}
}

function setAttrData() {
  console.log(JSON.parse(JSON.stringify(this)))
  const data = {
    title: '搜索设置',
    labelSize:'L',
    content: [
      {
        type: 'addbtn',
        text: '热词管理',
        label: '添加热词',
        editCB: (item) => {
          const temp = [...this.value.hot];

          temp.push('热词');
          //这个value也会作用在Preview中的SearchComponents组件
          Vue.set(this.value, 'hot', temp);

          //这里重新生成的attrData应该会在组件中直接显示。 也就是说我只需要直接把this给activeAttr即可
          this.setIndex(0, {value:false,config:false});
          this.vm.$store.commit('activeAttr', this);// 传出去

          return;


        },
      },
      {
        type: 'arr',
        row_type: 'text', // text/num这些代表简单的值，可以直接设置。
        label: '热词名称',
        value: this.value.hot,
        // 之类是输入的回调，可以根据需要决定写什么
        inputCB: (item) => {
          this.value.hot = [...item.value];
          //这里重新生成的attrData应该会在组件中直接显示。 也就是说我只需要直接把this给activeAttr即可
          this.vm.$store.commit('activeAttr', this);// 传出去
        },
        removeCB: (idx) => {

          this.value.hot.splice(idx, 1);

          //这里重新生成的attrData应该会在组件中直接显示。 也就是说我只需要直接把this给activeAttr即可
          this.setIndex(0, {value:false,config:false});
          this.vm.$store.commit('activeAttr', this);// 传出去

        }
        // 用函数来包容万象，返回数组
        // getFunc:()=>{
        //   let arr = this.config.hot,rt = [];
        //   for(var i in  arr){
        //     rt[i] = {label:'热词名称',val:arr[i]}
        //   }
        //   return rt;
        // },

      },
      {
        type: 'radio',
        text: '样式',
        editType: 'config',
        editKey: 'type',
        model: this.config.type,
        value: [
          {
            label: '方形',
            value: 'square',
          },
          {
            label: '圆形',
            value: 'round',
          },
        ],
      },

      {
        type: 'radio',
        text: '定位方式',
        editType: 'style',
        editKey: 'position',
        model: this.style.position,
        value: [
          {
            label: '普通布局',
            value: 'inherit',
          },
          {
            label: '绝对定位',
            value: 'absolute',
          },
        ],
      },
      {
        type: 'slider',
        text: '高度',
        min: 24,
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
      {
        type: 'color',
        text: '搜索框背景色',
        model: this.style.inputBgColor,
        editType: 'style',
        editKey: 'inputBgColor',
        editCB: item => item.model,
      },
      {
        type: 'color',
        text: '文本颜色',
        model: this.style.color,
        editType: 'style',
        editKey: 'color',
        editCB: item => item.model,
      },
    ],
  };

  Vue.set(this, 'attrData', data);
}

function attrData(options = {}) {
  // @ts-ignore
  const {value, config, attrData} = options;
  console.log(value, config, attrData, JSON.parse(JSON.stringify(this)));
  if (value !== false) setValue.call(this);
  if (config !== false) setConfig.call(this);
  if (attrData !== false) setAttrData.call(this);
  console.log(JSON.parse(JSON.stringify(this)));
}


class Search extends Common {

  tag = 'search';
  // activeIndex = 0;

  style = {
    bgColor: '#fff',
    height: 30,
    color: '',
    inputBgColor: '',
    position:'inherit',
    x:0,
    y:0
  }

  /**
   * @bgColor 组件背景颜色
   * @height 高度
   * @color 文字颜色
   * @inputBgColor  输入框背景
   */
  styleDefault = {
    bgColor: '#fff',
    height: 30,
    color: '#444',
    inputBgColor: '#f2f2f2',
    position:'inherit',
    x:0,
    y:0
  }

  config = {
    type: 'round', // quare
  }

  value = {
    hot: ['女装'],
  }



  constructor() {
    super();


    // 统一这样来初始化
    attrData.call(this, {});
  }

  // value = []


  setIndex(index: number, options: object) {
    this.activeIndex = index;
    attrData.call(this, options);
  }
}

export default Search;
