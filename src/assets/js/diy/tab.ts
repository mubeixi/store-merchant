import Vue from 'vue';
import Common from './commonClass';
import {ls} from "@/common/tool/ls";
import {fun} from "../../../common";

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
    title: '分类商品设置',
    content: [

      {
        type: 'addbtn',
        text: '分类设置',
        label: '新增分类',

        // openBindLink:(pageEl,item,idx)=>{
        //   pageEl.bindLinkDialogShow = true
        // },
        dialogCB: (list) => {


          this.value.list = [...list];

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

          this.value.list.push({
            type: 'all',
            cate_id: [],
            title: '分类名称',
            limit: 10,//显示的个数
          });//新增一个空元素


          //这里重新生成的attrData应该会在组件中直接显示。 也就是说我只需要直接把this给activeAttr即可
          this.setIndex(0, {value:false,config:false});
          this.vm.$store.commit('activeAttr', this);// 传出去

        },
      },
      {
        type: 'arr',
        row_type: 'cate', // text/num这些代表简单的值，可以直接设置。
        label: '',
        value: this.value.list,
        arr: this.value.list,
        radioCB: (item) => {
        },//后面的radio回调
        bindCB: (dataType, type, path, tooltip, dataArr, pageEl, idx2) => {

          console.log(dataType, type, path, tooltip, dataArr, pageEl, idx2)
          pageEl.bindCateDialogShow = false;

          let tabItemEl = document.getElementById('tab-item' + idx2);
          if (tabItemEl) {
            tabItemEl.click();
          }

          let ids = dataArr.map(item=>item.id)

          Vue.set(this.value.list[idx2], 'cate_id', ids);
          //Vue.set(this.value.list[idx2], 'title', tooltip);
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
        type: 'radio',
        text: '菜单位置',
        editType: 'config',
        editKey: 'position',
        model: this.config.position,
        value: [
          {
            label: '上方',
            value: 'top',
          },
          {
            label: '左侧',
            value: 'left',
          },

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
        type: 'radio',
        text: '图片比例',
        editType: 'config',
        editKey: 'ratio',
        model: this.config.ratio,
        value: [
          {
            label: '1/1',
            value: 1/1,
          },
          {
            label: '1/2',
            value: 1/2,
          },
          {
            label: '3/4',
            value: 3/4,
          },
          {
            label: '9/16',
            value: 9/16,
          }
        ],
      },
      {
        type: 'radio',
        text: '图片填充',
        editType: 'config',
        editKey: 'fill',
        model: this.config.fill,
        value: [
          {
            label: '填充',
            value: 'cover',
          },
          {
            label: '周边留白',
            value: 'contain',
          },
        ],
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
        type: 'checkbox',
        text: '显示内容',
        label: '商品名称',
        editType: 'config',
        disabled:this.config.attr.title.readOnly,
        model: this.config.attr.title.show,
        editCB: (item) => {


          Vue.set(this.config.attr.title, 'show', item.model);//传递值

          //这里重新生成的attrData应该会在组件中直接显示。 也就是说我只需要直接把this给activeAttr即可
          this.setIndex(0, {value:false,config:false});
          this.vm.$store.commit('activeAttr', this);// 传出去


        }
      },
      {
        type: 'checkbox',
        label: '商品描述',
        editType: 'config',
        model: this.config.attr.desc.show,
        editCB: (item) => {

          console.log(item.model)

          Vue.set(this.config.attr.desc, 'show', item.model);//传递值

          //这里重新生成的attrData应该会在组件中直接显示。 也就是说我只需要直接把this给activeAttr即可
          this.setIndex(0, {value:false,config:false});
          this.vm.$store.commit('activeAttr', this);// 传出去


        }
      },
      {
        type: 'checkbox',
        label: '商品价格',
        editType: 'config',
        model: this.config.attr.price.show,
        editCB: (item) => {

          console.log(item.model)

          Vue.set(this.config.attr.price, 'show', item.model);//传递值

          //这里重新生成的attrData应该会在组件中直接显示。 也就是说我只需要直接把this给activeAttr即可
          this.setIndex(0, {value:false,config:false});
          this.vm.$store.commit('activeAttr', this);// 传出去


        }
      },
      {
        type: 'diy',
        row_type: 'buybtn',
        label: '购买按钮',
        editType: 'config',
        model: this.config.attr.buybtn.show,
        data: this.config.attr.buybtn,
        checkboxCB: (val) => {

          Vue.set(this.config.attr.buybtn, 'show', val);//传递值

          //这里重新生成的attrData应该会在组件中直接显示。 也就是说我只需要直接把this给activeAttr即可
          this.setIndex(0, {value:false,config:false});
          this.vm.$store.commit('activeAttr', this);// 传出去

        },
        inputCB: (val) => {


          Vue.set(this.config.attr.buybtn, 'text', val);//传递值

          //这里重新生成的attrData应该会在组件中直接显示。 也就是说我只需要直接把this给activeAttr即可
          this.setIndex(0, {value:false,config:false});
          this.vm.$store.commit('activeAttr', this);// 传出去

        },
        radioCB: (val) => {
          Vue.set(this.config.attr.buybtn, 'style', val);//传递值

          //这里重新生成的attrData应该会在组件中直接显示。 也就是说我只需要直接把this给activeAttr即可
          this.setIndex(0, {value:false,config:false});
          this.vm.$store.commit('activeAttr', this);// 传出去

        },
      },
      {
        type: 'diy',
        row_type: 'tag',
        label: '标签',
        editType: 'config',
        model: this.config.attr.tag.show,

        data: this.config.attr.tag,
        checkboxCB: (val) => {

          Vue.set(this.config.attr.tag, 'show', val);//传递值
          Vue.set(this.config.attr.tag, 'style', 'diy');

          //这里重新生成的attrData应该会在组件中直接显示。 也就是说我只需要直接把this给activeAttr即可
          this.setIndex(0, {value:false,config:false});
          this.vm.$store.commit('activeAttr', this);// 传出去

        },//勾选的回调
        radioImgCB: (img, idx2) => {


          Vue.set(this.config.attr.tag, 'img', img.data.path);
          Vue.set(this.config.attr.tag, 'style', 'diy');

          //这里重新生成的attrData应该会在组件中直接显示。 也就是说我只需要直接把this给activeAttr即可
          this.setIndex(0, {value:false,config:false});
          this.vm.$store.commit('activeAttr', this);// 传出去

        },
        radioCB: (item) => {
        },//后面的radio回调
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


class Tab extends Common {

  tag = 'tab';
  activeIndex = 0;

  style = {
    wrapmargin: 15,//页面边距
    margin: 10,//商品距离
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
    position: 'left',//位置 可选值为left和top
    origin: 'filter',
    origintooltip: '请绑定',//提示语
    style: 1,
    showmode: 'noborder-bgwhite',//'border-bgwhite','noborder-nobg'  无边框白底 有边框白底 无边框透明底
    radius: 'round',//圆角 none直角
    attr: {
      title: {show: true,readOnly:true},
      desc: {show: false},
      price: {show: true},
      buybtn: {show: true, text: '购买', style: '1'}, //样式1 样式2
      tag: {show: false, style: '', img: ''} //hot new diy 第三个是图片。 都是放在商品左上角
    }
    // loop:false,//是否循环
    // interval:5000,//切换时间
    // autoplay:false,//自动播放
    //type: 1, //两种风格
  }

  value = {
    // cate_id:null,
    // limit:20,
    list: [
      {
        type: 'all',
        cate_id: [],
        title: '分类名称',
        limit: 10,//显示的个数
      }
    ]
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

export default Tab;
