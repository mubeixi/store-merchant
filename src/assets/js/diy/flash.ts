import Vue from 'vue';
import Common from './commonClass';
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


function setAttrData() {
  const data = {
    title: '限时抢购',
    content: [

      {
        type: 'origin',
        text: '绑定活动',
        // pintuan_flag:1,
        flashsale_flag:1,
        editType: 'config',
        editKey: 'origin',
        model: this.config.origin,
        spike_id:this.value.spike_id,
        origintooltip: this.value.spike_id ?'已绑定活动':this.config.origintooltip,
        limit: this.value.limit,
        cate_id: this.value.cate_id,
        // bindListCB: (list, pageEl) => {
        //   console.log(list)
        //
        //   let tempArr = list.map(goods => {
        //     return goods.Products_ID
        //   })
        //
        //
        //   Vue.set(this.config, 'origin', 'filter');
        //   Vue.set(this.value, 'list', tempArr);
        //   Vue.set(this.value, 'cate_id', []);
        //
        //   pageEl.bindListDialogShow = false;
        //
        //
        //   //这里重新生成的attrData应该会在组件中直接显示。 也就是说我只需要直接把this给activeAttr即可
        //   this.setIndex(0, {value:false,config:false});
        //   this.vm.$store.commit('activeAttr', this);// 传出去
        //
        // },
        // bindCateCB: (dataType, type, path, tooltip, dataArr, pageEl, idx2) => {
        //
        //   console.log(dataArr)
        //   pageEl.bindSpikeDialogShow = false;
        //
        //   let ids = dataArr.map(item=>item.id)
        //   Vue.set(this.config, 'origin', 'cate');
        //   Vue.set(this.value, 'cate_id', ids);
        //   Vue.set(this.config, 'origintooltip', tooltip);
        //
        //   //这里重新生成的attrData应该会在组件中直接显示。 也就是说我只需要直接把this给activeAttr即可
        //   this.setIndex(0, {value:false,config:false});
        //   this.vm.$store.commit('activeAttr', this);// 传出去
        //
        // },
        bindItemCB: (obj, pageEl) => {

          console.log(obj)

            if(!obj.id)return;
            let tempArr =[]


            Vue.set(this.config, 'origin', 'spiket');
            Vue.set(this.value, 'list', tempArr);
            Vue.set(this.value, 'cate_id', []);



            //重点是这一句
            Vue.set(this.value, 'spike_id', obj.id);
            Vue.set(this.config, 'origintooltip', obj.name);


            pageEl.bindSpikeDialogShow = false;


            //这里重新生成的attrData应该会在组件中直接显示。 也就是说我只需要直接把this给activeAttr即可
            this.setIndex(0, {value:false,config:false});
            this.vm.$store.commit('activeAttr', this);// 传出去

        },
        inputCB: (val) => {

          Vue.set(this.value, 'limit', parseInt(val));
          Vue.set(this.config, 'origin', 'cate');

          //这里重新生成的attrData应该会在组件中直接显示。 也就是说我只需要直接把this给activeAttr即可
          this.setIndex(0, {value:false,config:false});
          this.vm.$store.commit('activeAttr', this);// 传出去

        },
        editCB: (item) => {

          this.config.origin = item.model;//手动赋值一下

          //这里重新生成的attrData应该会在组件中直接显示。 也就是说我只需要直接把this给activeAttr即可
          this.setIndex(0, {value:false,config:false});
          this.vm.$store.commit('activeAttr', this);// 传出去

        },
        value: [
          {
            label: '筛选产品',
            value: 'filter',//挑选
          },
          // {
          //   label: '产品分类',
          //   value: 'cate',
          // }
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
          // {
          //   label: '横向滑动',
          //   value: 4,
          // },
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
        disabled:this.config.origin === 'filter' && this.config.attr.title.readOnly,
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


class Flash extends Common {

  tag = 'flash';
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
    origin: 'filter',
    origintooltip: '请绑定',//提示语
    style: 1,
    fill:'cover',
    ratio:1,
    showmode: 'noborder-bgwhite',//'border-bgwhite','noborder-nobg'  无边框白底 有边框白底 无边框透明底
    radius: 'round',//圆角 none直角
    attr: {
      title: {show: true,readOnly:true},
      desc: {show: false},
      price: {show: true},
      buybtn: {show: true, text: '立即抢购', style: '1'}, //样式1 样式2
      tag: {show: false, style: '', img: ''} //hot new diy 第三个是图片。 都是放在商品左上角
    }
    // loop:false,//是否循环
    // interval:5000,//切换时间
    // autoplay:false,//自动播放
    //type: 1, //两种风格
  }

  value = {
    cate_id: [],
    spike_id:null,
    limit: 20,
    list: []
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

export default Flash;
