import Vue from 'vue';
import Common from './commonClass';
import { deepCopy } from '@/common/utils';
import {ls} from "@/common/tool/ls";

const shopInfo = ls.get('Shop_Info')

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

// cover:'',
//   style:1,
//   showmode:'noborder-bgwhite',//'border-bgwhite','noborder-nobg'  无边框白底 有边框白底 无边框透明底
//   radius:'round',//圆角 none直角
//   attr:{
//   title:{show:true},
//   desc:{show:true},
//   pirce:{show:true},
//   buybtn:{show:true,text:'购买',style:1}, //样式1 样式2
//   tag:{show:true,style:'hot'} //hot new imgPath 第三个是图片。 都是放在商品左上角
// }

//
// wrapmargin:15,//页面边距
//   margin:10,//商品距离
//   // bgColor: '',

function setAttrData() {
  const data = {
    title: '店铺信息设置',
    content: [
      {
        type: 'origin',
        text: '商品来源',
        editType: 'config',
        editKey: 'origin',
        model: this.config.origin,
        origintooltip:this.config.origintooltip,
        limit:this.value.limit,
        cate_id:this.value.cate_id,
        bindListCB:(list,pageEl)=>{
          console.log(list)

          let tempArr = list.map(goods=>{
            return goods.Products_ID
          })



          Vue.set(this.config,'origin','filter');
          Vue.set(this.value,'list',tempArr);
          Vue.set(this.value,'cate_id',null);

          pageEl.bindListDialogShow = false;

          this.setIndex(0, { config: false, value: false });
          // // 都是改写vuex里面的数据，两种写法都可以
          this.vm.$store.commit('attrData', this.attrData);// 传出去
          this.vm.$store.state.activeAttr.value = this.value;
          this.vm.$store.state.activeAttr.config = this.config;


        },
        bindCateCB:(dataType, type, path, tooltip, dataItem,pageEl,idx2)=>{

          console.log(dataItem)
          pageEl.bindCateDialogShow = false;
          Vue.set(this.config,'origin','cate');
          Vue.set(this.value,'cate_id',dataItem.id);
          Vue.set(this.config,'origintooltip',tooltip);
          //
          this.setIndex(0, { config: false, value: false });
          // // 都是改写vuex里面的数据，两种写法都可以
          this.vm.$store.commit('attrData', this.attrData);// 传出去
          this.vm.$store.state.activeAttr.value = this.value;
          this.vm.$store.state.activeAttr.config = this.config;

        },
        inputCB:(val)=>{

          Vue.set(this.value,'limit',parseInt(val));
          Vue.set(this.config,'origin','cate');
          this.setIndex(0, { config: false, value: false });
          // // 都是改写vuex里面的数据，两种写法都可以
          this.vm.$store.commit('attrData', this.attrData);// 传出去
          this.vm.$store.state.activeAttr.value = this.value;

        },
        value: [
          {
            label: '筛选产品',
            value: 'filter',//挑选
          },
          {
            label: '产品分类',
            value: 'cate',
          }
        ],
      },
      {
        type: 'radio',
        text: '显示模式',
        editType: 'config',
        editKey: 'style',
        model: this.config.style,
        value: [
          {
            label: '大图模式',
            value: 1,
          },
          {
            label: '一行两个',
            value: 2,
          },
          {
            label: '详细列表',
            value: 3,
          },
          {
            label: '横向滑动',
            value: 4,
          },
        ],
      },
      {
        type: 'slider',
        text: '页面边距',
        editType: 'style',
        editKey: 'wrapmargin',
        model: this.style.wrapmargin,
      },
      {
        type: 'slider',
        text: '商品边距',
        editType: 'style',
        editKey: 'margin',
        model: this.style.margin,
      },
      {
        type: 'radio',
        text: '商品模式',
        editType: 'config',
        editKey: 'showmode',
        model: this.config.showmode,
        value: [
          {
            label: '无边框白底',
            value: 'noborder-bgwhite',
          },
          {
            label: '有边框白底',
            value: 'border-bgwhite',
          },
          {
            label: '无边框透明底',
            value: 'noborder-nobg',
          }
        ],
      },
      {
        type: 'radio',
        text: '图片倒角',
        editType: 'config',
        editKey: 'radius',
        model: this.config.radius,
        value: [
          {
            label: '直角',
            value: 'none',
          },
          {
            label: '圆角',
            value: 'round',
          },
        ],
      },

      {
        type: 'checkbox',
        text:'显示内容',
        label: '商品名称',
        editType: 'config',
        model: this.config.attr.title.show,
        editCB:(item)=>{



          Vue.set(this.config.attr.title,'show',item.model);//传递值

          this.vm.$store.state.activeAttr.config = this.config;

          this.setIndex(0, { config: false, value: false });
          //都是改写vuex里面的数据，两种写法都可以
          this.vm.$store.commit('attrData', this.attrData);// 传出去
          //this.vm.$store.state.activeAttr.value.list = this.value.list;


        }
      },
      {
        type: 'checkbox',
        label: '商品描述',
        editType: 'config',
        model: this.config.attr.desc.show,
        editCB:(item)=>{

          console.log(item.model)

          Vue.set(this.config.attr.desc,'show',item.model);//传递值

          this.vm.$store.state.activeAttr.config = this.config;

          this.setIndex(0, { config: false, value: false });
          //都是改写vuex里面的数据，两种写法都可以
          this.vm.$store.commit('attrData', this.attrData);// 传出去
          //this.vm.$store.state.activeAttr.value.list = this.value.list;


        }
      },
      {
        type: 'checkbox',
        label: '商品价格',
        editType: 'config',
        model: this.config.attr.price.show,
        editCB:(item)=>{

          console.log(item.model)

          Vue.set(this.config.attr.price,'show',item.model);//传递值

          this.vm.$store.state.activeAttr.config = this.config;

          this.setIndex(0, { config: false, value: false });
          //都是改写vuex里面的数据，两种写法都可以
          this.vm.$store.commit('attrData', this.attrData);// 传出去
          //this.vm.$store.state.activeAttr.value.list = this.value.list;


        }
      },
      {
        type: 'diy',
        row_type:'buybtn',
        label: '购买按钮',
        editType: 'config',
        model: this.config.attr.buybtn.show,
        data:this.config.attr.buybtn,
        checkboxCB:(val)=>{

          Vue.set(this.config.attr.buybtn,'show',val);//传递值

          this.vm.$store.state.activeAttr.config = this.config;
          this.setIndex(0, { config: false, value: false });
          //都是改写vuex里面的数据，两种写法都可以
          this.vm.$store.commit('attrData', this.attrData);// 传出去

        },
        inputCB:(val)=>{


          Vue.set(this.config.attr.buybtn,'text',val);//传递值

          this.vm.$store.state.activeAttr.config = this.config;
          this.setIndex(0, { config: false, value: false });
          //都是改写vuex里面的数据，两种写法都可以
          this.vm.$store.commit('attrData', this.attrData);// 传出去

        },
        radioCB:(val)=>{
          Vue.set(this.config.attr.buybtn,'style',val);//传递值

          this.vm.$store.state.activeAttr.config = this.config;
          this.setIndex(0, { config: false, value: false });
          //都是改写vuex里面的数据，两种写法都可以

          this.vm.$store.commit('attrData', this.attrData);// 传出去
        },
      },
      {
        type: 'diy',
        row_type:'tag',
        label: '标签',
        editType: 'config',
        model: this.config.attr.tag.show,

        data:this.config.attr.tag,
        checkboxCB:(val)=>{

          Vue.set(this.config.attr.tag,'show',val);//传递值
          Vue.set(this.config.attr.tag,'style','diy');
          this.vm.$store.state.activeAttr.config = this.config;
          this.setIndex(0, { config: false, value: false });
          //都是改写vuex里面的数据，两种写法都可以
          this.vm.$store.commit('attrData', this.attrData);// 传出去

        },//勾选的回调
        radioImgCB:(img,idx2)=>{


          Vue.set(this.config.attr.tag,'img',img.data.path);
          Vue.set(this.config.attr.tag,'style','diy');
          //
          this.setIndex(0, { config: false, value: false });
          // // 都是改写vuex里面的数据，两种写法都可以
          this.vm.$store.commit('attrData', this.attrData);// 传出去
          this.vm.$store.state.activeAttr.config = this.config;

        },
        radioCB:(item)=>{},//后面的radio回调
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


class Goods extends Common {

  tag = 'goods';
  // activeIndex = 0;

  style = {
    wrapmargin:15,//页面边距
    margin:10,//商品距离
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
    origin:'filter',
    origintooltip:'请绑定',//提示语
    style:1,
    showmode:'noborder-bgwhite',//'border-bgwhite','noborder-nobg'  无边框白底 有边框白底 无边框透明底
    radius:'round',//圆角 none直角
    attr:{
      title:{show:false},
      desc:{show:false},
      price:{show:false},
      buybtn:{show:false,text:'立即购买',style:null}, //样式1 样式2
      tag:{show:false,style:'',img:''} //hot new diy 第三个是图片。 都是放在商品左上角
    }
    // loop:false,//是否循环
    // interval:5000,//切换时间
    // autoplay:false,//自动播放
    //type: 1, //两种风格
  }

  value = {
    cate_id:null,
    limit:20,
    list:[]
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

export default Goods;