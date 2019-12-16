import Vue from 'vue';
import Common from './commonClass';
import {fun} from "@/common";


function setValue() {
  // let value = {}
  // Vue.set(this, 'value', value)
}

function setConfig() {
  if (JSON.stringify(this.style) === JSON.stringify({
    color: '',
    bgColor: '',
    padding:'',
    paddingc:'',
    fontSize:'',
    textAlign:''
  })) {
    Vue.set(this, 'style', JSON.parse(JSON.stringify(this.styleDefault)));
  }

  // let config = {}
  // Vue.set(this, 'config', config)
}

function setAttrData() {
  const data = {
    title: '标题设置',
    content: [
      {
        type: 'input',
        text: '名称',
        inputType: 'input',
        editType: 'value',
        editKey: 'title',
        model: this.value.title,
        editCB: item => item.model,
      },
      {
        type: 'input',
        text: '副标题',
        inputType: 'input',
        editType: 'value',
        editKey: 'small',
        model: this.value.small,
        editCB: item => item.model,
      },
      {
        type: 'uploadImg',
        text: '标签图片',
        tip: '建议上传宽度不超过4px的纯色图片',
        uploadType: 'avatar',
        showDelIcon:true,
        model: this.config.icon,
        mini:true,
        editType: 'config',
        editKey: 'icon',
        editCB: item => item.model,
      },
      {
        type: 'input',
        text: '左右边距',
        inputType: 'number',
        editType: 'style',
        editKey: 'padding',
        model: this.style.padding,
      },
      {
        type: 'input',
        text: '上下边距',
        inputType: 'number',
        editType: 'style',
        editKey: 'paddingc',
        model: this.style.paddingc,
      },
      {
        type: 'input',
        text: '字体大小',
        inputType: 'number',
        editType: 'style',
        editKey: 'fontSize',
        model: this.style.fontSize,
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
        type: 'radio',
        text: '对齐模式',
        editType: 'style',
        editKey: 'textAlign',
        model: this.style.textAlign,
        value: [
          {
            label: '居左',
            value: 'left',
          },
          {
            label: '居中',
            value: 'center',
          },

        ],
      },
      {
        type: 'color',
        text: '文字颜色',
        model: this.style.color,
        editType: 'style',
        editKey: 'color',
        editCB: item => item.model,
      },
      // {
      //   type: 'setlink',
      //   text: '跳转链接',
      //   editType: 'value',
      //   editKey: 'link',
      //   model: this.value,
      //   bindLinkCB: (dataType, type, path, tooltip, dataItem, pageEl, idx2) => {
      //
      //     console.log(dataType, type, path, tooltip, dataItem, pageEl, idx2)
      //     pageEl.bindLinkDialogShow = false;
      //
      //     Vue.set(this.value, 'link', path);
      // Vue.set(this.value, 'ext', dataItem);
      //     Vue.set(this.value, 'linkType', type);
      //     Vue.set(this.value, 'tooltip', tooltip);
      //
      //     //这里重新生成的attrData应该会在组件中直接显示。 也就是说我只需要直接把this给activeAttr即可
      //     this.setIndex(0, {value:false,config:false});
      //     this.vm.$store.commit('activeAttr', this);// 传出去
      //
      //   },
      // },
      {
        type: 'addbtn',
        text: '文本导航',
        label: '新增',
        // openBindLink:(pageEl,item,idx)=>{
        //   pageEl.bindLinkDialogShow = true
        // },
        // dialogCB:(list)=>{
        //
        //   this.value.more = [...list];
        //   this.setIndex(0, { config: false, value: false });
        //   //
        //   // // 都是改写vuex里面的数据，两种写法都可以
        //   this.vm.$store.commit('attrData', this.attrData);// 传出去
        //
        //   this.vm.$store.state.activeAttr.value.list = this.value.list;// 传出去
        // },
        //这个按钮的功能，主要是新增元素
        editCB: (pageEl) => {

          if (this.value.more.length >= 1) {
            fun.info({msg: '最多允许添加一个'});
            return;
          }

          this.value.more.push({title: '查看更多>', link: '', linkType: null, tooltip: ''});//新增一个空元素

          //这里重新生成的attrData应该会在组件中直接显示。 也就是说我只需要直接把this给activeAttr即可
          this.setIndex(0, {value:false,config:false});
          this.vm.$store.commit('activeAttr', this);// 传出去

        },
      },
      {
        type: 'arr',
        row_type: 'title', // text/num这些代表简单的值，可以直接设置。
        label: '',
        value: this.value.more,
        bindCB: (dataType, type, path, tooltip, dataItem, pageEl, idx2) => {

          console.log(dataType, type, path, tooltip, dataItem, pageEl, idx2)
          pageEl.bindLinkDialogShow = false;

          Vue.set(this.value.more[idx2], 'link', path);
          Vue.set(this.value.list[idx2], 'ext', dataItem);
          Vue.set(this.value.more[idx2], 'linkType', type);
          Vue.set(this.value.more[idx2], 'tooltip', tooltip);

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
          this.value.more.splice(idx, 1);

          //这里重新生成的attrData应该会在组件中直接显示。 也就是说我只需要直接把this给activeAttr即可
          this.setIndex(0, {value:false,config:false});
          this.vm.$store.commit('activeAttr', this);// 传出去

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

    ],
  };


  Vue.set(this, 'attrData', data);
}

function attrData(options = {}) {
  // @ts-ignore
  const {value, config, attrData} = options;
  if (value !== false) setValue.call(this);
  if (config !== false) setConfig.call(this);
  if (attrData !== false) setAttrData.call(this);
}

//
class Title extends Common {
  tag = 'title';
  // activeIndex = 0;

  style = {
    color: '',
    bgColor: '#fff',
    padding:'',
    paddingc:'',
    fontSize:'',
    textAlign:''
  }

  styleDefault = {
    color: '#333',
    bgColor: '#fff',
    paddingc:10,
    padding:10,
    fontSize:16,
    textAlign:''
  }

  config = {
    icon:''
  }


  value = {
    more: [],
    link: '',
    linkType: '',
    tooltip: '',
    title: '大标题',
    small: '小标题',
  }


  constructor() {
    super();

    // 统一这样来初始化
    attrData.call(this);
  }

  // value = []

  setIndex(index: number, options: object) {
    this.activeIndex = index;
    attrData.call(this, options);
  }
}

export default Title;
