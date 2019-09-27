import Vue from 'vue';
import Common from './commonClass';
import { deepCopy } from '@/common/utils';
import {fun} from "@/common";

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
    title: '图片混排',
    content: [
      {
        type: 'radio',
        text: '显示模式',
        editType: 'config',
        editKey: 'type',
        model: this.config.type,
        value: [
          {
            label: '图片导航',
            value: 1,
          },
          {
            label: '文字导航',
            value: 2,
          },

        ],
      },
      // {
      //   type: 'addbtn',
      //   text: '数据设置',
      //   label: '新增',
      //   // openBindLink:(pageEl,item,idx)=>{
      //   //   pageEl.bindLinkDialogShow = true
      //   // },
      //   dialogCB:(coupon_list)=>{
      //
      //     this.value.list = [...coupon_list];
      //     this.setIndex(0, { config: false, value: false });
      //     //
      //     // // 都是改写vuex里面的数据，两种写法都可以
      //     this.vm.$store.commit('attrData', this.attrData);// 传出去
      //
      //     this.vm.$store.state.activeAttr.value.list = this.value.list;// 传出去
      //   },
      //   //这个按钮的功能，主要是新增元素
      //   editCB: (pageEl) => {
      //     if(this.value.list.length>=10){
      //       fun.info({msg:'最多允许十个'});
      //       return;
      //     }
      //     this.value.list.push({
      //       title:'',
      //       img:'',
      //       link:'',
      //       linkType:''
      //     });//新增一个空元素
      //     this.setIndex(0, { config: false, value: false });
      //
      //     //都是改写vuex里面的数据，两种写法都可以
      //     this.vm.$store.commit('attrData', this.attrData);// 传出去
      //     this.vm.$store.state.activeAttr.value.list = this.value.list;// 传出去
      //
      //     // // 设置一下
      //     // this.setIndex(0, { config: false, value: false });
      //     //
      //     // // 都是改写vuex里面的数据，两种写法都可以
      //     // this.vm.$store.commit('attrData', this.attrData);// 传出去
      //     // this.vm.$store.state.activeAttr.value.list = this.value.list;// 传出去
      //   },
      // },
      {
        type: 'MagicCube',
        text: '区域设置',
        value: this.value.list,
        bindCB:()=>{



        },
        // 之类是输入的回调，可以根据需要决定写什么
        imgCB: (item,idx2) => {


        },
        removeCB:(idx)=>{

        }

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

/**
 * 魔方类
 */
class Cube extends Common {
  tag = 'cube';
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
    type:1,
    // loop:false,//是否循环
    // interval:5000,//切换时间
    // autoplay:false,//自动播放
    //type: 1, //两种风格
  }
  // img: "/uploadfiles/wkbq6nc2kc/image/SwiftFox_ZH-CN9413097062_1920x1080.jpg"
  // link: "/product/list?cate_id=194"
  // linkType: "cate"
  // title: "dsadsdadas"
  // tooltip: "分类：男装"
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

export default Cube;
