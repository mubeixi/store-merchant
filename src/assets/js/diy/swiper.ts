import Vue from 'vue';
import Common from './commonClass';
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
    title: '图片Banner',
    labelSize:'L',
    content: [
      // {
      //   type: 'color',
      //   text: '背景颜色',
      //   model: this.style.bgColor,
      //   editType: 'style',
      //   editKey: 'bgColor',
      //   editCB: item => item.model,
      // },
      {
        type: 'addbtn',
        text: '图片管理',
        label: '新增图片',
        // openBindLink:(pageEl,item,idx)=>{
        //   pageEl.bindLinkDialogShow = true
        // },
        dialogCB: (coupon_list) => {



          this.value.list = [...coupon_list];

          //这里重新生成的attrData应该会在组件中直接显示。 也就是说我只需要直接把this给activeAttr即可
          this.setIndex(0, {value:false,config:false});
          this.vm.$store.commit('activeAttr', this);// 传出去
        },
        //这个按钮的功能，主要是新增元素
        editCB: (pageEl) => {

          if(this.value.list.length > 9){
            fun.info({msg:'最多只允许十张图片'})
            return;
          }

          this.value.list.push({img_src: '', link: '', linkType: null});//新增一个空元素

          //这里重新生成的attrData应该会在组件中直接显示。 也就是说我只需要直接把this给activeAttr即可
          this.setIndex(0, {value:false,config:false});
          this.vm.$store.commit('activeAttr', this);// 传出去
        },
      },
      {
        type: 'arr',
        row_type: 'swiper', // text/num这些代表简单的值，可以直接设置。
        label: '',
        value: this.value.list,
        bindCB: (dataType, type, path, tooltip, dataItem, pageEl, idx2) => {

          console.log(dataType, type, path, tooltip, dataItem, pageEl, idx2)
          pageEl.bindLinkDialogShow = false;

          //console.log(dataType, type, path, tooltip, dataItem,pageEl,idx2)
          Vue.set(this.value.list[idx2], 'link', path);
          Vue.set(this.value.list[idx2], 'ext', dataItem);
          Vue.set(this.value.list[idx2], 'linkType', type);
          Vue.set(this.value.list[idx2], 'tooltip', tooltip);

          //这里重新生成的attrData应该会在组件中直接显示。 也就是说我只需要直接把this给activeAttr即可
          this.setIndex(0, {value:false,config:false});
          this.vm.$store.commit('activeAttr', this);// 传出去

        },
        // 之类是输入的回调，可以根据需要决定写什么
        imgCB: (item, idx2) => {
          console.log(item.data.path, idx2)
          Vue.set(this.value.list[idx2], 'img_src', item.data.path);

          //这里重新生成的attrData应该会在组件中直接显示。 也就是说我只需要直接把this给activeAttr即可
          this.setIndex(0, {value:false,config:false});
          this.vm.$store.commit('activeAttr', this);// 传出去
        },
        removeCB: (idx) => {
          this.value.list.splice(idx, 1);
          //这里重新生成的attrData应该会在组件中直接显示。 也就是说我只需要直接把this给activeAttr即可
          this.setIndex(0, {value:false,config:false});
          this.vm.$store.commit('activeAttr', this);// 传出去
        }

      },

      {
        type: 'input',
        // inputType: 'number',
        text: '滚动间隔(s)',
        editType: 'config',
        editKey: 'interval',
        model: this.config.interval,
        inputCB: (item) => item.model
      },
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
  // @ts-ignore
  const {value, config, attrData} = options;
  // console.log(value, config, attrData);
  if (value !== false) setValue.call(this);
  if (config !== false) setConfig.call(this);
  if (attrData !== false) setAttrData.call(this);
}


class Swiper extends Common {
  tag = 'swiper';
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
    loop: false,//是否循环
    interval: 5,//切换时间
    autoplay: true,//自动播放
    //type: 1, //两种风格
  }

  value = {
    list: [{img_src: '', link: '', linkType: null},{img_src: '', link: '', linkType: null},{img_src: '', link: '', linkType: null}],//存优惠券数组
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

export default Swiper;
