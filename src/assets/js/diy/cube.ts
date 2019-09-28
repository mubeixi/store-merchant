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
        type: 'slider',
        text: '页面边距',
        editType: 'style',
        editKey: 'wrapmargin',
        model: this.style.wrapmargin,
      },
      {
        type: 'slider',
        text: '图片间距',
        editType: 'style',
        editKey: 'margin',
        model: this.style.margin,
      },
      {
        type: 'radio',
        text: '行列数',
        editType: 'config',
        editKey: 'row',
        model: this.config.row,
        editCB:(item)=>{
          console.log(item)


          Vue.set(this.config,'row',item.model);

          this.setIndex(0, { config: false, value: false });
          this.vm.$store.state.activeAttr.config = this.config;

          this.vm.$store.commit('attrData', this.attrData);// 传出去


          return item.model;



        },
        value: [
          {
            label: '5',
            value: 5,
          },
          {
            label: '7',
            value: 7,
          },
          {
            label: '10',
            value: 10,
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
        text: '内容设置',
        row:this.config.row,
        value: this.value.list,
        //数据变化放进来的
        seclectChangeCB:(arr)=>{

          //如果是数组的长度变小了
          if(arr.length<this.value.list.length){

            var ids = []
            for(var i in this.value.list){



              var j = 0 ;
              for(var area of arr){
                //如果都存在，则没有什么
                console.log(area.IDX,this.value.list[i].IDX)
                if(area.IDX === this.value.list[i].IDX){
                  j++;
                }
              }

              //记录要删除的多个
              if(!j){
                ids.push(parseInt(i))
              }

            }
            console.log('需要删除',ids)

            //倒序，索引从大到小 删除不受影响
            ids.reverse()
            for(var idx of ids){
              this.value.list.splice(idx,1)
            }

          }else{


            for(var i in arr){

              if(this.value.list[i]){

                Vue.set(this.value.list,i,arr[i]);//强制触发数据和视图绑定

              }else{

                Vue.set(this.value.list,i,{
                  link:'',
                  linkType:'',
                  tooltip:'',
                  ...arr[i]
                });//强制触发数据和视图绑定

              }

            }

          }


          this.vm.$store.state.activeAttr.value.list = this.value.list;


          //this.setIndex(0, { config: false, value: false });
          // // // 都是改写vuex里面的数据，两种写法都可以
          //this.vm.$store.commit('attrData', this.attrData);// 传出去

          //传递一下
          //this.vm.$store.state.activeAttr.value.list = [...list];



        },
        bindCB:(dataType, type, path, tooltip, dataItem,pageEl,idx2)=>{

          console.log(dataType, type, path, tooltip, dataItem,pageEl,idx2)
          pageEl.bindLinkDialogShow = false;

          console.log(this.value.list)
          // console.log(dataType, type, path, tooltip, dataItem,pageEl,idx2)
          Vue.set(this.value.list[idx2],'link',path);
          Vue.set(this.value.list[idx2],'linkType',type);
          Vue.set(this.value.list[idx2],'tooltip',tooltip);
          // //
          this.setIndex(0, { config: false, value: false });
          // // // 都是改写vuex里面的数据，两种写法都可以
          //this.vm.$store.commit('attrData', this.attrData);// 传出去
          this.vm.$store.state.activeAttr.value.list = this.value.list;

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
  console.log(this.config)
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
    type:1,
    row:10
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
