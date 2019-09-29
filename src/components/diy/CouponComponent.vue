<template>
  <div @click.stop="setData({}, 0)" class="coupon coupon-list wrap">
    <div class="list style1" v-if="coupon.config.type===1">
      <div class="item" v-for="(item,idx) in coupon.value.list">
        <p class="title">满{{item.Coupon_Condition}}享</p>
        <p class="info"> {{item.Coupon_UseType == 0?item.Coupon_Discount+'折扣':'￥'+item.Coupon_Cash+'
          减免'}}</p>
        <p class="area">({{item.Coupon_UseArea==0?'实体店':'微商城'}})</p>
      </div>
    </div>
    <div class="list style2" v-if="coupon.config.type===2">
      <div class="item" v-for="(item,idx) in coupon.value.list">
        <div class="l">
          <p class="title line4 font24" v-if="item.Coupon_UseType == 0">item.Coupon_Discount+'折'</p>
          <p class="title line4 font24" v-else><span class="font12 ">￥</span><span class="money">{{item.Coupon_Cash}}</span>
          </p>

          <p class="info line"> {{item.Coupon_UseArea==0?'实体店':'微商城'}}可用 |
            满￥{{item.Coupon_Condition}}可用</p>
          <p class="time graytext">{{item.Coupon_StartTime}}-{{item.Coupon_EndTime}}</p>
        </div>
        <div class="r">
          <div class="go">立即领取</div>
        </div>
      </div>
    </div>
    <div class="list style3" v-if="coupon.config.type===3">
      style3
    </div>
  </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {mapState} from 'vuex';
    import Coupon from '@/assets/js/diy/coupon';
    import {deepCopy} from '@/common/utils';

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
                coupon: {},
            };
        },
        computed: {
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
        filters: {},
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
            setData(item, index) {
                // console.log('hehe',this.search)
                this.$store.commit('activeAttr', this.coupon);// 这里点击之后，setAttr马上就有响应。

                this.$store.commit('tabIndex', this.index);

                // 用vuex就不要一层层传递了，头都晕了
                // this.$emit('setData', this.img.attrData)
            },
            // ...mapActions(),
        },

    })
    export default class CouponComponent extends Vue {
        created() {
            //用这个来搞事啊
            //funvm也是vue实例，而且不是根实例，是这个组件的实例，可以快捷的调用组件中的对象或者方法以及$ref
            Coupon.prototype.funvm = this;
            //Coupon.prototype.vm = this;
            this.$store.commit('tabIndex', this.index);// 设置tabIndex，等于templData是二维数组，这个是二维数组的
            this.coupon = deepCopy(new Coupon(), this.data);
        }
    }
</script>

<style scoped lang="less">

  .list {
    .item {
      p {
        margin: 0;
        padding: 0;
      }
    }
  }

  .coupon-list::-webkit-scrollbar {
    display: none;
  }

  .list::-webkit-scrollbar {
    display: none;
  }

  .style2 {
    margin: 0 10px 0;
    padding-top: 10px;

    .item {
      display: flex;
      margin-bottom: 10px;
      background: white;

      .l {
        flex: 1;
        padding: 10px;
        font-size: 12px;

        .title {
          font-size: 22px;

          font-family: "Microsoft YaHei";

          .money {

            margin-left: 4px;
            font-weight: 300;
          }
        }
      }

      .r {
        width: 120px;
        position: relative;
        background-size: 100% 100%;
        background-repeat: no-repeat;
        background-position: left center;
        background-image: url('data:image/png;base64,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');

        .go {
          position: absolute;
          left: 50%;
          top: 50%;
          font-size: 12px;
          color: white;
          transform: translate(-50%, -50%);
        }
      }
    }
  }

  .style1 {
    height: 72px;
    width: 100%;
    overflow-x: scroll;
    overflow-y: hidden;
    white-space: nowrap;

    .item {
      height: 72px;
      box-sizing: border-box;
      overflow: hidden;
      text-align: center;
      font-size: 14px;
      display: inline-block;
      margin-right: 6px;
      background: red;
      color: white;
      padding: 6px 20px;

      .title {

      }

      .info {
        font-size: 12px;
        margin: 4px 0;
      }

      .area {
        font-size: 12px;
      }
    }
  }


</style>
