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
  })) {
    Vue.set(this, 'style', JSON.parse(JSON.stringify(this.styleDefault)));
  }
  // let config = {}
}

function setAttrData() {
  const data = {
    title: '优惠券设置',
    content: [
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
        type: 'radio',
        text: '样式',
        editType: 'config',
        editKey: 'type',
        model: this.config.type,
        value: [
          {
            label: '样式1',
            value: 1,
          },
          {
            label: '样式2',
            value: 2,
          },
          {
            label: '样式3',
            value: 3,
          },
          {
            label: '样式4',
            value: 4,
          },
        ],
      },
      {
        type: 'addbtn',
        text: '',
        label: '选择优惠券',
        dialogCB: (coupon_list) => {

          this.value.list = [...coupon_list];

          //这里重新生成的attrData应该会在组件中直接显示。 也就是说我只需要直接把this给activeAttr即可
          this.setIndex(0, {value:false,config:false});
          this.vm.$store.commit('activeAttr', this);// 传出去
        },
        //这个按钮的功能，主要是新增页面吧
        editCB: (pageEl) => {

          let tempArr = []
          for (var i in this.value.list) {
            tempArr.push(this.value.list[i].Coupon_ID)
          }

          pageEl.coupon_ids = tempArr.join(',');
          pageEl.couponDialogShow = true;

        },
      },
      {
        type: 'arr',
        row_type: 'coupon', // text/num这些代表简单的值，可以直接设置。
        label: '优惠券',
        value: this.value.list,
        // 之类是输入的回调，可以根据需要决定写什么
        inputCB: (item) => {
          // this.value.list = [...item.value];
          //
          // this.vm.$store.state.activeAttr.value.list = this.value.list;// 传出去
        },
        removeCB: (idx) => {

          this.value.list.splice(idx, 1);

          //这里重新生成的attrData应该会在组件中直接显示。 也就是说我只需要直接把this给activeAttr即可
          this.setIndex(0, {value:false,config:false});
          this.vm.$store.commit('activeAttr', this);// 传出去
        }
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


class Coupon extends Common {
  tag = 'coupon';
  // activeIndex = 0;

  style = {
    bgColor: '#fff',
    // height: 30,
    // color: '',
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
    type: 1, // quare
  }

  value = {
    list: [],//存优惠券数组
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

export default Coupon;
