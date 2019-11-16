import Vue from 'vue';
import Common from './commonClass';


function setValue() {
  // let value = {}
  // Vue.set(this, 'value', value)
}

function setConfig() {
  // 如果新对象，那么可以考虑用默认值替换掉。
  // if (JSON.stringify(this.style) === JSON.stringify({
  //   bgColor: '',
  //   color: '',
  //   iconColor: '',
  // })) {
  //   Vue.set(this, 'style', JSON.parse(JSON.stringify(this.styleDefault)));
  // }
  // let config = {}
}

function setAttrData() {
  const data = {
    title: '公告设置',
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
        text: '图标颜色',
        model: this.style.iconColor,
        editType: 'style',
        editKey: 'iconColor',
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
      // {
      //   type: 'addbtn',
      //   text: '',
      //   label: '新增内容',
      //   dialogCB: (coupon_list) => {
      //
      //     this.value.list = [...coupon_list];
      //
      //     //这里重新生成的attrData应该会在组件中直接显示。 也就是说我只需要直接把this给activeAttr即可
      //     this.setIndex(0, {value:false,config:false});
      //     this.vm.$store.commit('activeAttr', this);// 传出去
      //   },
      //   //这个按钮的功能，主要是新增页面吧
      //   editCB: (pageEl) => {
      //     this.value.list.push('');
      //     //这里重新生成的attrData应该会在组件中直接显示。 也就是说我只需要直接把this给activeAttr即可
      //     this.setIndex(0, {value:false,config:false});
      //     this.vm.$store.commit('activeAttr', this);// 传出去
      //   },
      // },
      // {
      //   type: 'arr',
      //   row_type: 'text', // text/num这些代表简单的值，可以直接设置。
      //   label: '公告内容',
      //   value: this.value.list,
      //   inputCB: (item) => {},
      //   removeCB: (idx) => {
      //     this.value.list.splice(idx, 1);
      //     this.setIndex(0, {config: false, value: false});
      //     // // 都是改写vuex里面的数据，两种写法都可以
      //     this.vm.$store.commit('attrData', this.attrData);// 传出去
      //     this.vm.$store.state.activeAttr.value.list = this.value.list;
      //   }
      //
      // },

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


class Notice extends Common {
  tag = 'notice';
  // activeIndex = 0;

  style = {
    bgColor: '#fff',
    // height: 30,
    color: '',
    iconColor: '',
    // inputBgColor: '',
  }

  /**
   * @bgColor 组件背景颜色
   * @height 高度
   * @color 文字颜色
   * @inputBgColor  输入框背景
   */
  styleDefault = {
    // bgColor: '#fff',
    // height: 30,
    // color: '#444',
    // inputBgColor: '#f2f2f2',
  }

  config = {
    // bgColor: '#fff',
    // height: 30,
    // color: '#444',
    // type: 1, // quare
  }

  value = {
    content:'公告内容',
    list: ['通知公告1', '通知公告2', '通知公告3', '通知公告4'],//存优惠券数组
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

export default Notice;
