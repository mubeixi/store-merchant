<template>
  <div @click.stop="setData({}, 0)" class="goods wrap" id="goods" :style="{padding:goods.style.wrapmargin+'px'}">
    <div class="box" :class="[className]">
      <ul class="list" >
        <li v-for="(item,idx) in goodsList" class="item"
            :class="[idx%2==0?'even':'odd',goods.config.radius=='round'?'round':'',goods.config.showmode]"
            :style="[itemMarginObj(idx)]"
        >
          <div class="cover"
               :style="{width:itemw,height:itemw,backgroundImage:'url('+domainFunc(item.ImgPath)+')'}">
            <div v-show="goods.config.attr.tag.show" :class="goods.config.attr.tag.style"
                 v-if="['new','hot'].indexOf(goods.config.attr.tag.style)!=-1" class="tag">
              {{goods.config.attr.tag.style=='hot'?'hot':'new'}}
            </div>
            <div v-show="goods.config.attr.tag.show" v-else class="tag img"><img
              :src="goods.config.attr.tag.img|domain"/></div>
          </div>
          <div class="info" :style="{width:itemw}" :class="{empyInfo:isEmpeyInfo}">
            <div class="left">
              <div v-show="goods.config.attr.title.show" class="title">{{item.Products_Name}}</div>
              <div v-show="goods.config.attr.desc.show" class="font12 graytext desc">
                {{item.Products_BriefDescription||'暂无介绍'}}
              </div>
              <div v-show="goods.config.attr.price.show" class="price"><span class="sign">￥</span>{{item.Products_PriceX}}
              </div>
            </div>
            <div v-show="goods.config.attr.buybtn.show" class="buybtn" :class="'theme'+goods.config.attr.buybtn.style">
              {{goods.config.attr.buybtn.text||'购买'}}
            </div>
          </div>
        </li>

        <!--因为参数是带了limit,所以这里不会为负数-->
        <li v-for="(item,idx) in (limit-goodsList.length)" class="item"
            :class="[idx%2==0?'even':'odd',goods.config.radius=='round'?'round':'',goods.config.showmode]"
            :style="[itemMarginObj(idx)]"
        >
          <div class="cover"
               :style="{width:itemw,height:itemw,backgroundImage:'url('+domainFunc(infoTmpl.ImgPath)+')'}">
            <div v-show="goods.config.attr.tag.show" :class="goods.config.attr.tag.style"
                 v-if="['new','hot'].indexOf(goods.config.attr.tag.style)!=-1" class="tag">
              {{goods.config.attr.tag.style=='hot'?'hot':'new'}}
            </div>
            <div v-show="goods.config.attr.tag.show" v-else class="tag img"><img
              :src="goods.config.attr.tag.img|domain"/></div>
          </div>
          <div class="info" :style="{width:itemw}" :class="{empyInfo:isEmpeyInfo}">
            <div class="left">
              <div v-show="goods.config.attr.title.show" class="title">{{infoTmpl.Products_Name}}</div>
              <div v-show="goods.config.attr.desc.show" class="font12 graytext desc">
                {{infoTmpl.Products_BriefDescription||'暂无介绍'}}
              </div>
              <div v-show="goods.config.attr.price.show" class="price"><span class="sign">￥</span>{{infoTmpl.Products_PriceX}}
              </div>
            </div>
            <div v-show="goods.config.attr.buybtn.show" class="buybtn" :class="'theme'+goods.config.attr.buybtn.style">
              {{goods.config.attr.buybtn.text||'购买'}}
            </div>
          </div>
        </li>
      </ul>
    </div>

  </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {mapState} from 'vuex';
    import Goods from '@/assets/js/diy/goods';
    import {deepCopy, domain} from '@/common/utils';
    import {getProductList} from '@/common/fetch';

    @Component({
        props: {
            index: {
                required: true,
            },
            data: {
                type: Object,
                default: () => ({}),
            },
        },
        data() {
            return {
                goodsList: [],
                infoTmpl:{
                    Products_ID:33,
                    Products_Name:'商品名称',
                    Products_PriceX:99.99,
                    Products_BriefDescription:'商品简介',
                    ImgPath:''
                },
                goods: {},
                fullWidth: 0
            };
        },
        computed: {
            limit(){
              return this.goods.value.cate_id ? this.goods.value.limit :6
            },
            isEmpeyInfo() {
                return !this.goods.config.attr.title.show && !this.goods.config.attr.desc.show && !this.goods.config.attr.price.show && !this.goods.config.attr.buybtn.show
            },
            w() {
                return this.fullWidth;
            },
            itemw() {
                let full = this.fullWidth;
                if (this.goods.config.style === 2) {
                    //内边不是乘以3 而是1
                    return (full - this.goods.style.wrapmargin * 2 - this.goods.style.margin * 1) / 2 + 'px';
                }

                if (this.goods.config.style === 4) {
                    return full / 3 + 'px';
                }
                return 'auto';

            },
            className() {
                return 'style' + this.goods.config.style
            },
            style() {
                // return deepCopyStrict(this.coupon.styleDefault, this.coupon.style);
            },
            activeAttr: {
                get() {
                    return this.$store.state.activeAttr;
                },
                set(nval) {

                },
            },
            ...mapState(['editStatus']),
        },
        filters: {
            str2num(val) {
                return parseInt(val)
            }
        },
        watch: {
            'goods.value': {
                immediate: true,
                deep: true,
                handler(val) {

                    if (!val) return;
                    let {list = [], cate_id=[], limit} = val;

                    console.log(list,cate_id,limit)
                    //如果值还没有设置的话
                    if(list.length===0 && cate_id.length===0){
                        return;
                    }

                    let param = {pageSize: cate_id.length===0 && limit ? limit : 6}
                    if (cate_id.length>0) {
                        param.Cate_ID = cate_id.join(',')
                    } else {
                        param.Products_ID = list.join(',')
                    }

                    getProductList(param).then(res => {
                        this.goodsList = res.data

                    })

                }
            },
            // 属性变化
            activeAttr: {
                deep: true,
                handler(val) {

                },
            },
        },
        components: {},
        methods: {
            itemMarginObj(idx) {

                let conf = this.goods.style.margin;
                let {left = conf, top = conf, bottom = conf, right = conf} = {}
                // {marginBottom:tool.style.margin+'px',marginLeft:idx%2==0?tool.style.margin:tool.style.margin/2+'px',marginRight:idx%2==0?tool.style.margin/2:tool.style.margin+'px'}
                switch (this.goods.config.style) {
                    case 1:
                        top = 0;
                        left = 0;
                        right = 0;
                        break;
                    case 4:
                        top = 0;
                        bottom = 0;
                        left = 0;
                        break;
                    case 3:
                        top = 0;
                        left = 0;
                        right = 0;
                        break;
                    case 2:
                        console.log(idx)
                        top = 0;
                        left = idx % 2 == 0 ? 0 : conf / 2;
                        right = idx % 2 == 0 ? conf / 2 : 0;
                        break;
                }
                console.log({
                    marginTop: top + 'px',
                    marginBottom: bottom + 'px',
                    marginLeft: left + 'px',
                    marginRight: right + 'px'
                })
                return {
                    marginTop: top + 'px',
                    marginBottom: bottom + 'px',
                    marginLeft: left + 'px',
                    marginRight: right + 'px'
                }

            },
            getPic(jsonstr) {
                if (!jsonstr) return '';
                let obj = JSON.parse(jsonstr);
                if (!obj || !obj.ImgPath || obj.ImgPath.length < 1) return '';

                return domain(obj.ImgPath[0])
            },
            domainFunc(url) {
                if(!url){
                    return 'http://www.qiyeban.com/uploadfiles/wkbq6nc2kc/image/20190930095641111.png';//展位图替换掉吧。。
                }

                return domain(url)
            },
            setData(item, index) {
                // console.log('hehe',this.search)
                // @ts-ignore
                this.$store.commit('activeAttr', this.goods);// 这里点击之后，setAttr马上就有响应。

                // @ts-ignore
                this.$store.commit('tabIndex', this.index);

                // 用vuex就不要一层层传递了，头都晕了
                // this.$emit('setData', this.img.attrData)
            },
            // ...mapActions(),
        },

    })
    export default class GoodsComponent extends Vue {
        created() {
            let _self = this;
            this.$nextTick().then(res => {
                _self.fullWidth = document.getElementById('canvas').offsetWidth;
            })

            //用这个来搞事啊
            //funvm也是vue实例，而且不是根实例，是这个组件的实例，可以快捷的调用组件中的对象或者方法以及$ref
            Goods.prototype.funvm = this;
            //Goods.prototype.vm = this;
            this.$store.commit('tabIndex', this.index);// 设置tabIndex，等于templData是二维数组，这个是二维数组的
            this.goods = deepCopy(new Goods(), this.data);
        }
    }
</script>

<style scoped lang="less">
  @import "~@/assets/css/fun.less";

  .wrap{
    background: #f8f8f8;
  }
  //无边框白底 有边框白底 无边框透明底
  /*'noborder-bgwhite','border-bgwhite','noborder-nobg'*/
  .noborder-bgwhite{

  }

  .border-bgwhite{

    border: 1px solid #e3e3e3;
  }

  .noborder-nobg{
    .info{
      background: none !important;
    }
  }




  *::-webkit-scrollbar {
    display: none !important;
  }

  .cover {
    .cover-full-bg(cover, 0);
    height: 100%;
  }

  ul, li {
    .rest;
    display: block;
  }


  .empyInfo {
    padding: 0 !important;
  }

  .buybtn {
    color: #444;
    padding: 2px 14px;
    font-size: 14px;
    height: 24px;
    line-height: 24px;
    background: #ff4444;
    color: white;
    /*border: 1px solid #409EFF;*/

    &.theme1{
      background: #ff4444;
      color: white;
      border-radius: 1px;
    }

    &.theme2{
      color: #ff4444;
      background: white;
      border: 1px solid #ffacac;
    }
  }

  .tag {
    position: absolute;
    left: 0px;
    top: 0px;
    background: red;
    height: 20px;
    line-height: 20px;
    color: white;
    text-align: center;
    padding: 0 8px;
    border-radius: 0 0 4px 0;
    font-size: 12px;

    &.img {
      background: none;

      img {
        position: absolute;
        width: 16px;
        height: 16px;
        left: 0;
        top: 0;
      }
    }
  }

  .round {
    border-radius: 2%;
    overflow: hidden;
  }

  .desc {
    height: 12px;
    line-height: 12px;
    overflow-x: hidden;
    text-overflow: ellipsis;
  }

  .style1 {
    .list {
      .item {
        //margin-bottom: 10px;
        .cover {
          position: relative;
          .cover-full-bg(cover, 49%, #f7f7f7);

          .tag {

          }
        }

        .info {
          /*position: relative;*/
          background: white;
          padding: 10px;
          display: flex;
          justify-content: space-between;
          flex: 1;

          .title {
            height: 22px;
            line-height: 22px;
            overflow-x: hidden;
            text-overflow: ellipsis;
            color: #444;
            margin-bottom: 6px;
          }

          .desc {
            margin-bottom: 6px;
          }

          .price {
            .sign {
              font-size: 12px;
            }

            font-size: 16px;
            color: #f56c6c;
          }

          .buybtn {
            /*position: absolute;*/
            /*right: 10px;*/
            /*top:50%;*/
            /*transform: translateY(-50%);*/
          }
        }

      }
    }
  }

  .style2 {
    .list {
      display: flex;
      flex-wrap: wrap;

      .item {

        box-sizing: border-box;
        display: block;
        overflow: hidden;

        /*&.even{*/
        /*  margin: 10px 5px 10px 10px;*/
        /*}*/

        /*&.odd{*/
        /*  margin: 10px 10px 10px 5px;*/
        /*}*/

        .cover {
          position: relative;
          .cover-full-bg(cover, 0%, #f7f7f7);

          .tag {

          }
        }

        .info {
          width: 100%;
          background: white;
          padding: 10px;
          box-sizing: border-box;
          display: flex;
          justify-content: space-between;
          overflow: hidden;

          .left {
            flex: 1;

            .title {
              width: 100%;
              overflow-x: hidden;
              height: 21px;
              text-overflow: ellipsis;
              line-height: 21px;
              color: #444;
              margin-bottom: 6px;
              font-size: 14px;
            }

            .desc {
              margin-bottom: 6px;
            }

            .price {
              .sign {
                font-size: 12px;
              }

              font-size: 14px;

            }
          }

          .buybtn {
            font-size: 12px;
            height: 24px;
            line-height: 24px;
            /*position: absolute;*/
            /*right: 0;*/
            /*top:50%;*/
            /*transform: translateY(-50%);*/
          }
        }

      }
    }
  }


  .style3 {
    .list {


      .item {
        width: 100%;
        box-sizing: border-box;
        display: flex;
        overflow: hidden;
        //flex-direction:row-reverse;

        /*&.even{*/
        /*  margin: 10px 5px 10px 10px;*/
        /*}*/

        /*&.odd{*/
        /*  margin: 10px 10px 10px 5px;*/
        /*}*/


        .cover {
          position: relative;
          flex: 1;
          .cover-full-bg(cover, 35%, #f7f7f7);

          .tag {

          }
        }

        .info {
          width: 140px !important;
          /*width: 100%;*/
          background: white;
          padding: 10px;
          box-sizing: border-box;
          overflow: hidden;

          .left {

            .title {
              width: 100%;
              overflow-x: hidden;
              height: 21px;
              text-overflow: ellipsis;
              line-height: 21px;
              color: #444;
              margin-bottom: 6px;
              font-size: 14px;
            }

            .desc {
              margin-bottom: 6px;
            }

            .price {
              margin: 6px 0;

              .sign {
                font-size: 12px;
              }

              font-size: 14px;

            }
          }

          .buybtn {
            font-size: 12px;
            height: 24px;
            line-height: 24px;
            display: inline-block;
            /*position: absolute;*/
            /*right: 0;*/
            /*top:50%;*/
            /*transform: translateY(-50%);*/
          }
        }

      }
    }
  }

  .style4 {

    .list {

      white-space: nowrap;
      overflow-x: scroll;
      overflow-y: hidden;

      .item {

        display: inline-block;
        box-sizing: border-box;

        overflow: hidden;
        //flex-direction:row-reverse;

        /*&.even{*/
        /*  margin: 10px 5px 10px 10px;*/
        /*}*/

        /*&.odd{*/
        /*  margin: 10px 10px 10px 5px;*/
        /*}*/


        .cover {
          position: relative;
          flex: 1;
          .cover-full-bg(cover, 0%, #f7f7f7);

          .tag {

          }
        }

        .info {

          /*width: 100%;*/
          background: white;
          padding: 10px;
          box-sizing: border-box;
          overflow: hidden;

          .left {

            .title {
              width: 100%;
              overflow-x: hidden;
              height: 21px;
              text-overflow: ellipsis;
              line-height: 21px;
              color: #444;
              margin-bottom: 6px;
              font-size: 14px;
            }

            .desc {
              margin-bottom: 6px;
            }

            .price {
              margin: 6px 0;

              .sign {
                font-size: 12px;
              }

              font-size: 14px;

            }
          }

          .buybtn {
            font-size: 12px;
            height: 24px;
            line-height: 24px;
            display: inline-block;
            /*position: absolute;*/
            /*right: 0;*/
            /*top:50%;*/
            /*transform: translateY(-50%);*/
          }
        }

      }
    }
  }

</style>
