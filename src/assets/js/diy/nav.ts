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
    // bgColor: '',
    // height: 30,
    color: '',
    // inputBgColor: '',
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
        type: 'color',
        text: '文本颜色',
        model: this.style.color,
        editType: 'style',
        editKey: 'color',
        editCB: item => item.model,
      },
      {
        type: 'color',
        text: '背景颜色',
        // rgba:true,//透明度
        model: this.style.bgColor,
        editType: 'style',
        editKey: 'bgColor',
        editCB: item => {
          return item.model?item.model:'none'
        },
      },
      {
        type: 'addbtn',
        text: '数据设置',
        label: '新增',
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
          if (this.value.list.length >= 10) {
            fun.info({msg: '最多允许十个'});
            return;
          }
          this.value.list.push( {
            title: '标题',
            img: 'http://www.qiyeban.com/uploadfiles/wkbq6nc2kc/image/20191007114805119.png',
            link: '',
            linkType: '',
            tooltip: ''
          });//新增一个空元素

          //这里重新生成的attrData应该会在组件中直接显示。 也就是说我只需要直接把this给activeAttr即可
          this.setIndex(0, {value:false,config:false});
          this.vm.$store.commit('activeAttr', this);// 传出去
        },
      },
      {
        type: 'arr',
        row_type: 'nav', // text/num这些代表简单的值，可以直接设置。
        label: '',
        value: this.value.list,
        bindCB: (dataType, type, path, tooltip, dataItem, pageEl, idx2) => {

          console.log(dataType, type, path, tooltip, dataItem, pageEl, idx2)
          pageEl.bindLinkDialogShow = false;

          Vue.set(this.value.list[idx2], 'link', path);
          Vue.set(this.value.list[idx2], 'linkType', type);
          Vue.set(this.value.list[idx2], 'tooltip', tooltip);

          //这里重新生成的attrData应该会在组件中直接显示。 也就是说我只需要直接把this给activeAttr即可
          this.setIndex(0, {value:false,config:false});
          this.vm.$store.commit('activeAttr', this);// 传出去

        },
        // 之类是输入的回调，可以根据需要决定写什么
        imgCB: (item, idx2) => {

          Vue.set(this.value.list[idx2], 'img', item.data.path);


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

    ],
  };


  Vue.set(this, 'attrData', data);
}

function attrData(options = {}) {
  const {value, config, attrData} = options;
  // console.log(value, config, attrData);
  if (value !== false) setValue.call(this);
  if (config !== false) setConfig.call(this);
  if (attrData !== false) setAttrData.call(this);
}


class Nav extends Common {
  tag = 'nav';
  // activeIndex = 0;

  style = {
    bgColor: '#fff',
    // bgColor: '',
    // height: 30,
    color: '',
    // inputBgColor: '',
  }

  /**
   * @bgColor 组件背景颜色
   * @height 高度
   * @color 文字颜色
   * @inputBgColor  输入框背景
   */
  styleDefault = {
    bgColor: '#fff',
    // height: 30,
    color: '#444',
    // inputBgColor: '#f2f2f2',
  }

  config = {
    type: 1,
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
    list: [
      {
        title: '标题',
        img: 'http://www.qiyeban.com/uploadfiles/wkbq6nc2kc/image/20191007114805119.png',
        link: '',
        linkType: '',
        tooltip: ''
      },
      {
        title: '标题',
        img: 'http://www.qiyeban.com/uploadfiles/wkbq6nc2kc/image/20191007114805119.png',
        link: '',
        linkType: '',
        tooltip: ''
      },
      {
        title: '标题',
        img: 'http://www.qiyeban.com/uploadfiles/wkbq6nc2kc/image/20191007114805119.png',
        link: '',
        linkType: '',
        tooltip: ''
      },
      {
        title: '标题',
        img: 'http://www.qiyeban.com/uploadfiles/wkbq6nc2kc/image/20191007114805119.png',
        link: '',
        linkType: '',
        tooltip: ''
      },

    ],//存优惠券数组
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

export default Nav;
