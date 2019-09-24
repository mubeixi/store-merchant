import Vue from 'vue';
import Common from './commonClass';
import { deepCopy } from '@/common/utils';


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
        type: 'addbtn',
        text: '',
        label: '选择优惠券',
        dialogCb:(coupon_list)=>{

          this.value.list = [...coupon_list];
          this.setIndex(0, { config: false, value: false });
          //
          // // 都是改写vuex里面的数据，两种写法都可以
          this.vm.$store.commit('attrData', this.attrData);// 传出去

          this.vm.$store.state.activeAttr.value.list = this.value.list;// 传出去
        },
        //这个按钮的功能，主要是新增页面吧
        editCb: (pageEl) => {

          let tempArr = []
          for(var i in this.value.list){
            tempArr.push(this.value.list[i].Coupon_ID)
          }

          pageEl.coupon_ids = tempArr.join(',');
          pageEl.couponDialogShow = true;


          // // 设置一下
          // this.setIndex(0, { config: false, value: false });
          //
          // // 都是改写vuex里面的数据，两种写法都可以
          // this.vm.$store.commit('attrData', this.attrData);// 传出去
          // this.vm.$store.state.activeAttr.value.list = this.value.list;// 传出去
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
        removeCb:(idx)=>{
          this.value.list.splice(idx,1);

          this.setIndex(0, { config: false, value: false });
          // // 都是改写vuex里面的数据，两种写法都可以
          this.vm.$store.commit('attrData', this.attrData);// 传出去
          this.vm.$store.state.activeAttr.value.list = this.value.list;
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
            label: '样式1',
            value: 1,
          },
          {
            label: '样式2',
            value: 2,
          },
        ],
      },
    ],
  };


  Vue.set(this, 'attrData', data);
}

function attrData(options = {}) {
  const { value, config, attrData } = options;
  console.log(value, config, attrData);
  if (value !== false) setValue.call(this);
  if (config !== false) setConfig.call(this);
  if (attrData !== false) setAttrData.call(this);
}


class Coupon extends Common {
  tag = 'coupon';
  // activeIndex = 0;

  style = {
    // bgColor: '',
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
    list:[],//存优惠券数组
  }


  constructor() {
    super();


    // 统一这样来初始化
    attrData.call(this, {});
  }

  // value = []


  setIndex(index: Number, options: Object) {
    this.activeIndex = index;
    attrData.call(this, options);
  }
}

export default Coupon;
