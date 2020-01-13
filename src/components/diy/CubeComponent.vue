<template>
  <div @click.stop="setData({}, 0)" class="cube wrap" :style="{background:cube.style.bgColor}">
    <div class="box" :style="{width:fullW+'px'}">
      <div class="postion-wrap" :style="[getWrapStyle()]">
        <!--所有热区用绝对定位实现-->
        <div class="active" :data-idx="area.IDX" :style="[getAreaStyle(area)]"
             v-for="(area,aidx) in cube.value.list">
          <div class="mask" :style="{backgroundImage:'url('+domainFunc(area.bgimg)||''+')'}"></div>
        </div>

      </div>


    </div>
    <span class="fun-plugin-tag">图文混排</span>


  </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {mapState} from 'vuex';
    import Cube from '@/assets/js/diy/cube';
    import {deepCopy, domain} from '@/common/utils';
    import {getRowColSpan} from '@/assets/js/diy/tool/MagicCube';
    import {objTranslate} from '@/common/utils';

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
                cube: {},
                CTX: {},
                // colH:0,
                // colW:0

            };
        },
        computed: {
            fullW(){
                let ele = document.getElementById('canvas');
                if (ele) {
                    return ele.offsetWidth;
                } else {
                    return 375;
                }
            },
            // W() {
            //     let ele = document.getElementById('canvas');
            //     if (ele) {
            //         return ele.offsetWidth-2*this.cube.style.wrapmargin;
            //     } else {
            //         return 375-2*this.cube.style.wrapmargin;
            //     }
            // },
            // //这个方法需要调整下
            // colWH() {
            //
            //     return this.W / this.cube.config.row
            // },
            // colW() {
            //
            //     //得到横纵的缝隙
            //     let {rownum,colnum} = getRowColSpan(this.cube.value.list);
            //
            //     return (this.W) / colnum+1
            // },
            // colH() {
            //     //得到横纵的缝隙
            //     let {rownum,colnum} = getRowColSpan(this.cube.value.list);
            //
            //     return this.fullW*(1-this.cube.style.wrapmargin/this.fullW*2) / rownum+1
            // },
            W(){


                return this.fullW-2*this.cube.style.wrapmargin
            },
            H(){

                return this.fullW*this.cube.config.row/this.cube.config.col;
            },
            // colWH(){
            //
            //   const res = uni.getSystemInfoSync();
            //   return (res.screenWidth-2*this.cube.style.wrapmargin)/this.cube.config.row
            // },
            colH(){

                let Height = this.fullW*this.cube.config.row/this.cube.config.col;
                return Height/this.cube.config.row
            },
            rowW(){
                return (this.fullW-2*this.cube.style.wrapmargin)/this.cube.config.col
            },
            className() {
                return 'style1';//+this.nav.config.style
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
            'cube.value.list':{
              deep:true,
              immediate:true,
              handler:function(val){
                  // if(!val ||val.length<1)return;
                  // let {rownum,colnum} = getRowColSpan(val);
                  // this.colW = (this.W) / (colnum+1)
                  // this.colH = this.fullW*(1-this.cube.style.wrapmargin/this.fullW*2) / (rownum+1)
              }
            },
            'cube.config.row':{
              handler(val){

              }
            },
            data:{
                deep: true,
                handler(val) {
                    //this.cube = deepCopy(new Cube(), val)
                },
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
            getWrapStyle(){
                let styleObj = {
                    marginLeft:this.cube.style.wrapmargin+'px',
                    marginRight:this.cube.style.wrapmargin+'px',
                    width:this.fullW*(1-this.cube.style.wrapmargin/this.fullW*2)+'px',
                    height:this.H+'px',//高度不变的
                }

                return styleObj;
            },
            getAreaStyle(area) {
                let styleObj = {
                    left: area.x * this.rowW+'px',
                    top: area.y * this.colH  + 'px',
                    width: (area.x1 - area.x) * this.rowW + 'px',
                    height: (area.y1 - area.y) * this.colH + 'px',

                    borderTopWidth: area.y==0?0:this.cube.style.margin/2+'px',
                    borderLeftWidth: area.x==0?0:this.cube.style.margin/2+'px',
                    borderRightWidth: area.x1==this.cube.config.row?0:this.cube.style.margin/2+'px',
                    borderBottomWidth: area.y1==this.cube.config.row?0:this.cube.style.margin/2+'px',

                };

                return styleObj
            },
            domainFunc(url) {
                return domain(url)
            },
            setData(item, index) {
                // console.log('hehe',this.search)
                // @ts-ignore

                // console.log('1111111111activeAttr的值发生修改',objTranslate(this.cube))



                //拖一下勾？？
                //let Data = deepCopy(new Cube(), objTranslate(this.cube));
                this.$store.commit('activeAttr', this.cube);// 这里点击之后，setAttr马上就有响应。
                // @ts-ignore
                this.$store.commit('tabIndex', this.index);


                // 用vuex就不要一层层传递了，头都晕了
                // this.$emit('setData', this.img.attrData)
            },
            // ...mapActions(),
        },

    })
    export default class CubeComponent extends Vue {
        async created() {
            //用这个来搞事啊
            //funvm也是vue实例，而且不是根实例，是这个组件的实例，可以快捷的调用组件中的对象或者方法以及$ref
            Cube.prototype.funvm = this;
            //Cube.prototype.vm = this;
            this.$store.commit('tabIndex', this.index);// 设置tabIndex，等于templData是二维数组，这个是二维数组的
            this.cube = deepCopy(new Cube(), this.data);
            // console.log('新建cube组件的值',objTranslate(this.cube))


            //利用数据生成一下attrData

            //重新绑定attrData.content，让修改可以同步到其他地方
            this.cube.setIndex(0,{value:false,config:false})
            this.CTX = this.cube;
            // console.log('新建cube组件的值2222222222222222222222',objTranslate(this.cube))

        }
    }
</script>

<style scoped lang="less">
  @import "~@/assets/css/fun.less";


  .postion-wrap{
    position: relative;
    overflow: hidden;
  }


  .active {
    position: absolute;

    .mask {
      .cover-full-bg(cover, 0, #f2f2f2);
      position: absolute;
      left: 0px;
      bottom: 0px;
      right: 0px;
      top: 0px;

    }

    .img{
      /*position: absolute;*/
      /*left: 0;*/
      /*top: 0;*/
      /*width: 100%;*/
      /*height: 100%;*/
      /*vertical-align: baseline;*/
      /*opacity: 0;*/
    }

    &.act {
      border: 1px rgba(63, 142, 243, 1) solid;

      .delicon {
        visibility: visible;
      }
    }

    box-sizing: border-box;
    border: 1px #f2f2f2 solid;

    /*background: rgba(63, 142, 243, 0.1);*/
    box-sizing: border-box;
    /*z-index: 2;*/

    &:hover {
      .delicon {
        visibility: visible;
      }
    }

    .delicon {
      visibility: hidden;
      position: absolute;
      font-size: 20px;
      right: -10px;
      top: -10px;
      z-index: 339;
      cursor: pointer;
      color: #66b1ff;

      &:hover {
        color: #409eff;
      }
    }
  }

  .box {

    position: relative;
    min-height: 20px;
    overflow: hidden;

    /*box-sizing: border-box;*/

    .row {
      /*box-sizing: border-box;*/

      .column {
        display: inline-block;
        box-sizing: border-box;

        &:last-child {
          .border-right(0px);
        }

        .border-right();
        .border-bottom();
      }

      &:last-child {
        .column {
          .border-bottom(0px);
        }
      }
    }
  }
</style>
