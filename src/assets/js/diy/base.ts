import Vue from 'vue';
import Common from './commonClass';
import {ss,ls} from "@/common/tool/ls";

const shopInfo = ss.get('Shop_Info')

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
    title: '店铺信息设置',
    content: [
      {
        type: 'uploadImg',
        text: '背景图',
        uploadType: 'avatar',
        model: this.config.cover,
        editType: 'config',
        editKey: 'cover',
        editCB: item => item.model,
      },
      {
        type: 'radio',
        text: '样式',
        editType: 'config',
        editKey: 'style',
        model: this.config.style,
        value: [
          {
            label: '样式一',
            value: 1,
          },
          {
            label: '样式二',
            value: 2,
          },
        ],
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


class Base extends Common {

  tag = 'base';
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
    cover: '',
    logo: shopInfo.ShopLogo,
    title: shopInfo.ShopName,
    desc: shopInfo.description,
    total: shopInfo.prod_total,
    new: shopInfo.prod_isnew_total,
    style: 1

    // loop:false,//是否循环
    // interval:5000,//切换时间
    // autoplay:false,//自动播放
    //type: 1, //两种风格
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

export default Base;
