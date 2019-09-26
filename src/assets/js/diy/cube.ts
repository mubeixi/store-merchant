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
    title: '图文导航设置',
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
      {
        type: 'addbtn',
        text: '数据设置',
        label: '新增',
        // openBindLink:(pageEl,item,idx)=>{
        //   pageEl.bindLinkDialogShow = true
        // },
        dialogCB:(coupon_list)=>{

          this.value.list = [...coupon_list];
          this.setIndex(0, { config: false, value: false });
          //
          // // 都是改写vuex里面的数据，两种写法都可以
          this.vm.$store.commit('attrData', this.attrData);// 传出去

          this.vm.$store.state.activeAttr.value.list = this.value.list;// 传出去
        },
        //这个按钮的功能，主要是新增元素
        editCB: (pageEl) => {
          if(this.value.list.length>=10){
            fun.info({msg:'最多允许十个'});
            return;
          }
          this.value.list.push({
            title:'',
            img:'',
            link:'',
            linkType:''
          });//新增一个空元素
          this.setIndex(0, { config: false, value: false });

          //都是改写vuex里面的数据，两种写法都可以
          this.vm.$store.commit('attrData', this.attrData);// 传出去
          this.vm.$store.state.activeAttr.value.list = this.value.list;// 传出去

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
        row_type: 'nav', // text/num这些代表简单的值，可以直接设置。
        label: '',
        value: this.value.list,
        bindCB:(dataType, type, path, tooltip, dataItem,pageEl,idx2)=>{

          console.log(dataType, type, path, tooltip, dataItem,pageEl,idx2)
          pageEl.bindLinkDialogShow = false;

          console.log(dataType, type, path, tooltip, dataItem,pageEl,idx2)
          Vue.set(this.value.list[idx2],'link',path);
          Vue.set(this.value.list[idx2],'linkType',type);
          Vue.set(this.value.list[idx2],'tooltip',tooltip);
          //
          this.setIndex(0, { config: false, value: false });
          // // 都是改写vuex里面的数据，两种写法都可以
          this.vm.$store.commit('attrData', this.attrData);// 传出去
          this.vm.$store.state.activeAttr.value.list = this.value.list;

        },
        // 之类是输入的回调，可以根据需要决定写什么
        imgCB: (item,idx2) => {

          Vue.set(this.value.list[idx2],'img',item.data.path);

          this.setIndex(0, { config: false, value: false });
          // // 都是改写vuex里面的数据，两种写法都可以
          this.vm.$store.commit('attrData', this.attrData);// 传出去
          this.vm.$store.state.activeAttr.value.list = this.value.list;

          // this.value.list = [...item.value];
          //
          // this.vm.$store.state.activeAttr.value.list = this.value.list;// 传出去
        },
        removeCB:(idx)=>{
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

      // {
      //   type: 'input',
      //   // inputType: 'number',
      //   text: '滚动间隔',
      //   editType: 'config',
      //   editKey: 'interval',
      //   model: this.config.interval,
      //   inputCB:(item)=>item.model
      // },
      // {
      //   type: 'switch',
      //   text: '循环播放',
      //   editType: 'config',
      //   editKey: 'loop',
      //   model: this.config.loop,
      //   value: [
      //     {
      //       label: '关闭',
      //       value: false,
      //     },
      //     {
      //       label: '开启',
      //       value: true,
      //     },
      //   ],
      // },
      // {
      //   type: 'switch',
      //   text: '自动滚动',
      //   editType: 'config',
      //   editKey: 'autoplay',
      //   model: this.config.autoplay,
      //   value: [
      //     {
      //       label: '关闭',
      //       value: false,
      //     },
      //     {
      //       label: '开启',
      //       value: true,
      //     },
      //   ],
      // },
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
    list:[
      {
        title:'',
        img:'',
        link:'',
        linkType:'',
        tooltip:''
      },
      {
        title:'',
        img:'',
        link:'',
        linkType:'',
        tooltip:''
      },
      {
        title:'',
        img:'',
        link:'',
        linkType:'',
        tooltip:''
      },
      {
        title:'',
        img:'',
        link:'',
        linkType:'',
        tooltip:''
      },
    ],//存优惠券数组
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
