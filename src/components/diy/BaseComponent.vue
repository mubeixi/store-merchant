<template>
  <div @click.stop="setData({}, 0)" class="base wrap">
    <div class="cover" :class="[className]"
         :style="{backgroundImage:'url('+domainFunc(base.config.cover)+')'}">
      <div class="logotitle">
        <img class="logo" :src="base.config.logo|domain"/>
        <div class="title">{{base.config.title}}</div>
      </div>
      <!--      <div class="desc">{{base.config.desc}}</div>-->
      <!--      <div class="total">商品 {{base.config.total}}</div>-->
      <!--      <div class="new">新品 {{base.config.new}}</div>-->
    </div>
  </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {mapState} from 'vuex';
    import Base from '@/assets/js/diy/base';
    import {deepCopy, domain} from '@/common/utils';

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
            };
        },
        computed: {
            className() {
                return 'style' + this.base.config.style
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
                // console.log('hehe',this.search)
                this.$store.commit('activeAttr', this.base);// 这里点击之后，setAttr马上就有响应。

                this.$store.commit('tabIndex', this.index);

                // 用vuex就不要一层层传递了，头都晕了
                // this.$emit('setData', this.img.attrData)
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
        }
    }
</script>

<style scoped lang="less">
  @import "~@/assets/css/fun.less";


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
      display: flex;
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

  .style2 {
    height: 185px;
    color: white;
    position: relative;
    background-color: #d2dee7;
    border: 1px solid black;
    //border-radius: 0 0 50% 50% / 0 0 100% 100%;
    border-top: none;
    overflow: hidden;

    .logotitle {
      position: absolute;
      left: 30px;
      bottom: 50px;
      display: flex;
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
