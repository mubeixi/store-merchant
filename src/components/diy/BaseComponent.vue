<template>
  <div @click.stop="setData({}, 0)" class="base wrap">
    <div class="cover" :class="[className]"
         :style="{backgroundImage:'url('+domainFunc(base.config.cover)+')'}">
      <div class="logotitle">
        <div class="flex">
          <img class="logo" style="margin-top: 8px" :src="base.config.logo|domain"/>
          <div class="title">
            <div style="line-height: 32px">{{info.ShopName}}</div>
            <div class="flex" style="line-height: initial">
              <div class="total font12">全部商品{{info.prod_total}} </div>
              <div class="new font12" style="margin-left: 4px;"> 上新{{info.prod_isnew_total}}</div>
            </div>
          </div>
        </div>

      </div>
<!--            <div class="desc">{{base.config.desc}}</div>-->

<!--      -->
      <div v-if="base.config.style===2" class="round">
        <div class="mask" :style="{height:3.5933*W+'px',width:3.5933*W+'px',backgroundSize:W+'px',backgroundImage:'url('+domainFunc(base.config.cover)+')'}"></div>
      </div>

<!--      <canvas id="myCanvas" class="round">-->
<!--        浏览器不支持 Canvas-->
<!--      </canvas>-->
    </div>
    <span class="fun-plugin-tag">基础信息</span>

  </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {mapState} from 'vuex';
    import Base from '@/assets/js/diy/base';
    import {deepCopy, domain} from '@/common/utils';
    import {getProductCountInfo} from "../../common/fetch";

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
                base: {},
                info:{}
            };
        },
        computed: {
            className() {
                return 'style' + this.base.config.style
            },
            W() {
                let ele = document.getElementById('canvas');
                if (ele) {
                    return ele.offsetWidth;
                } else {
                    return 375;
                }
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
            // 属性变化
            activeAttr: {
                deep: true,
                handler(val) {

                },
            },
        },
        components: {},
        methods: {
            domainFunc(url) {
                return domain(url)
            },
            setData(item, index) {
                // @ts-ignore
                this.$store.commit('activeAttr', this.base);// 这里点击之后，setAttr马上就有响应。
                // @ts-ignore
                this.$store.commit('tabIndex', this.index);
            },
            // ...mapActions(),
        },

    })
    export default class BaseComponent extends Vue {


        created() {
            //用这个来搞事啊
            //funvm也是vue实例，而且不是根实例，是这个组件的实例，可以快捷的调用组件中的对象或者方法以及$ref
            Base.prototype.funvm = this;
            this.$store.commit('tabIndex', this.index);// 设置tabIndex，等于templData是二维数组，这个是二维数组的
            this.base = deepCopy(new Base(), this.data);
            //重新绑定attrData.content，让修改可以同步到其他地方
            this.base.setIndex(0,{value:false,config:false})

            getProductCountInfo().then(res=>{
              console.log(res)

              this.info = res.data

            })


        }
    }
</script>

<style scoped lang="less">
  @import "~@/assets/css/fun.less";

.wrap{
  overflow: hidden;
}

  .cover {
    .cover-full-bg(cover, 0);
    height: 100%;
  }

  .style1 {
    height: 160px;
    color: white;
    position: relative;
    background-color: #d2dee7;

    .logotitle {
      position: absolute;
      left: 30px;
      bottom: 20px;
      /*display: flex;*/
    }

    .logo {
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }

    .title {
      /*line-height: 40px;*/
      margin-left: 10px;
    }

    .desc {
    }

    .total {
    }

    .new {
    }
  }

  .style2 {
    height: 185px;
    color: white;
    position: relative;
    background: none !important;
    /*border: 1px solid black;*/
    /*border-bottom-right-radius: 50% 15%;*/
    /*border-bottom-left-radius: 50% 15%;*/
    /*border-top: none;*/
    /*overflow: hidden;*/


    .round{
      position: absolute;
      bottom: 0px;
      left: 0;
      right: 0;
      height: 40px;
      /*overflow: hidden;*/
      background: none;
      /*z-index: 0;*/
      .mask{
        position: absolute;
        background-position: bottom center;

        /*background-repeat: no-repeat;*/
        border-radius: 50%;
        left: 50%;
        bottom: 0px;
        transform: translateX(-50%)
      }
    }

    .logotitle {
      position: absolute;
      left: 30px;
      bottom: 50px;
      display: flex;
      z-index: 3;
    }

    .logo {
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }

    .title {
      line-height: 40px;
      margin-left: 10px;
    }

    .desc {
    }

    .total {
    }

    .new {
    }
  }

</style>
