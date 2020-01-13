<template>
  <div @click.stop="setData({}, 0)" class="coupon coupon-list wrap" :style="{background:coupon.style.bgColor}">
    <div class="list style1" :class="[couponList.length<4?'style1flex':'style1block']" v-if="coupon.config.type===1 && couponList.length>0">
      <div class="item" v-for="(item,idx) in couponList">
        <p class="title">满{{item.Coupon_Condition}}享</p>
        <p class="info"> {{item.Coupon_UseType == 0?item.Coupon_Discount+'折扣':'￥'+item.Coupon_Cash+'减免'}}</p>
        <p class="area">({{item.Coupon_UseArea==0?'实体店':'微商城'}})</p>
      </div>
    </div>
    <div class="list style2"  v-if="coupon.config.type=== 2 && couponList.length>0">
      <div class="item" v-for="(item,idx) in couponList">
        <div class="c">
          <p v-if="item.Coupon_UseType == 0">满￥{{item.Coupon_Condition}} {{item.Coupon_Discount+'折'}}</p>
          <p v-else><span>满￥{{item.Coupon_Condition}} 减 {{item.Coupon_Cash+'元'}}</span></p>
        </div>
      </div>
    </div>
    <div class="list style3"  v-if="coupon.config.type=== 3 && couponList.length>0">
      <div class="item" v-for="(item,idx) in couponList">
        <div class="c">
          <p v-if="item.Coupon_UseType == 0">满￥{{item.Coupon_Condition}} {{item.Coupon_Discount+'折'}}</p>
          <p v-else><span>满￥{{item.Coupon_Condition}} 减 {{item.Coupon_Cash+'元'}}</span></p>
        </div>
        <div class="r">
          <div class="go">立即领取</div>
        </div>
      </div>
    </div>
    <div class="list style4"  v-if="coupon.config.type=== 4 && couponList.length>0">
      <div class="item" v-for="(item,idx) in couponList">
        <div class="c">
          <div class="cwrap">
            <p v-if="item.Coupon_UseType == 0">满￥{{item.Coupon_Condition}} {{item.Coupon_Discount+'折'}}</p>
            <p v-else><span>满￥{{item.Coupon_Condition}} 减 {{item.Coupon_Cash+'元'}}</span></p>
          </div>
        </div>
      </div>
    </div>
    <div v-if="couponList.length<1" class="text-center graytext font12 padding10-r">请先添加优惠券</div>
    <span class="fun-plugin-tag">优惠券</span>
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
            couponList(){
                if(this.coupon.value.list.length<1){
                    return []
                }
                return this.coupon.value.list
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
                // @ts-ignore
                this.$store.commit('activeAttr', this.coupon);// 这里点击之后，setAttr马上就有响应。

                // @ts-ignore
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

            //重新绑定attrData.content，让修改可以同步到其他地方
            this.coupon.setIndex(0,{value:false,config:false})

            // if(this.data.value && this.data.value.list.length>0){
            //     this.coupon.value.list = [...this.data.value.list];
            // }

        }
    }
</script>

<style scoped lang="less">
  .wrap{
    padding:0 10px;
  }
  .list {
    .item {
      p {
        margin: 0;
        padding: 0;
      }
    }
  }

  /*.coupon-list::-webkit-scrollbar {*/
  /*  display: none;*/
  /*}*/

  /*.list::-webkit-scrollbar {*/
  /*  display: none;*/
  /*}*/

  .style4 {
    /*margin: 0 10px 0;*/
    /*padding-top: 10px;*/
    width: 100%;
    overflow-x: scroll;
    overflow-y: hidden;
    white-space: nowrap;


    .item {
      /*display: flex;*/
      display: inline-block;
      height: 70px;
      position: relative;
      margin-right: 10px;



      &:before,&:after{
        background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAB6CAYAAACyaQNgAAAACXBIWXMAAAsTAAALEwEAmpwYAAAGCGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIiB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDoyODZiNWI5Ni05YjI3LTRkNGUtODQ4NS1lYmU5MDJkOGI4MGMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QjY4MjlDN0VFOENBMTFFOTk5OTk5Q0ExMUQ1RDBCNDkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6ZjJiM2YwYjktZjZjNy1lYzRiLWJjZmItYTQwNzBkMGIzODM3IiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE4IChXaW5kb3dzKSIgeG1wOkNyZWF0ZURhdGU9IjIwMTktMTAtMDdUMTQ6MjE6MzUrMDg6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDE5LTEwLTA3VDE0OjQ4OjQ0KzA4OjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDE5LTEwLTA3VDE0OjQ4OjQ0KzA4OjAwIiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIgcGhvdG9zaG9wOklDQ1Byb2ZpbGU9InNSR0IgSUVDNjE5NjYtMi4xIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MWM1NzBkMzgtZWJkMC1hNjQwLWI2MjQtMjdjNmM0NTRhMjZlIiBzdFJlZjpkb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6NDY3ZjUzMzgtNGFiZS1lZjQ0LTkyYmItMGZlM2RlZDA1NzNhIi8+IDx4bXBNTTpIaXN0b3J5PiA8cmRmOlNlcT4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmYyYjNmMGI5LWY2YzctZWM0Yi1iY2ZiLWE0MDcwZDBiMzgzNyIgc3RFdnQ6d2hlbj0iMjAxOS0xMC0wN1QxNDo0ODo0NCswODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pn6jNJkAAAF+SURBVGiB7drBS8JwFAfw92u/Ocbolhf1oCAFIYaOziGrQylkFNifF50SkhKqS4F5DrWSkiDTKPNgx2zMba5TETp1c4su73t878eHxw9+p98j7VQE7EZdiD+xD+XQ79qMbQUA9DlfbrA2FWTwwpE7EPXcugKZZSqIaL2oO5Dc3XIFYt7fth1D8uquSOvV0GDdNkSbtWOiqUN1W5AiJk7Yx5uAWc8ypCyvZblKMTmqTycBspSR6HNtj7s6N53kB1LnYw3d6z80eCFvUE8ZAIBovTiRu5tMp7XDX+aCoGsTJybtVMSYeMpC/veJIIQQQgghhBBCCCGEEEIIIYQQQgghhBBCCCGEEEIIIYTQuFA1vPSie/15Q5jNGtRzDbomkL4uks+PdabTSrONu4DV/7WxB2QpI9Hm/T5br/ocQd9RxMQpVyluQL9v2rd8R1ypkFRiK2ej+rYumysVkmo4+uoYAgDQgotpYIY/U21D/MVBSQ1HG44hAFxlsJI/XWX4AiA4dto06pcXAAAAAElFTkSuQmCC");
        content: "";
        position: absolute;
        top: 0;
        width: 15px;
        height: 100%;
        background-size: 100% 100%;
      }

      &:after{
        right: 0;
        transform: rotateY(180deg);
      }

      .l{}

      .c {
        margin: 0 15px;
        background-color: #e74c2c;
        padding: 10px 6px;
        box-sizing: border-box;
        color: white;
        height: 70px;
        line-height: 40px;//padding10
        text-align: center;
        font-size: 14px;
        .cwrap{
          padding: 5px;
          border:1px solid #c1c1c1;
          /*margin: 10px;*/
        }

        /*.title {*/
        /*  font-size: 22px;*/

        /*  font-family: "Microsoft YaHei";*/

        /*  .money {*/

        /*    margin-left: 4px;*/
        /*    font-weight: 300;*/
        /*  }*/
        /*}*/
      }

      /*.r {*/
      /*  width: 120px;*/
      /*  position: relative;*/
      /*  background-size: 100% 100%;*/
      /*  background-repeat: no-repeat;*/
      /*  background-position: left center;*/

      /*  .go {*/
      /*    position: absolute;*/
      /*    left: 50%;*/
      /*    top: 50%;*/
      /*    font-size: 12px;*/
      /*    color: white;*/
      /*    transform: translate(-50%, -50%);*/
      /*  }*/
      /*}*/
    }
  }

  .style3 {
    /*margin: 0 10px 0;*/
    /*padding-top: 10px;*/

    width: 100%;
    overflow-x: scroll;
    overflow-y: hidden;
    white-space: nowrap;

    .item {

      height: 70px;
      display: inline-block;
      margin-right: 20px;
      position: relative;
      padding-right: 100px;

      background: white;

      &:before{
        background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAACECAYAAACklspSAAAACXBIWXMAAAsTAAALEwEAmpwYAAAGCGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIiB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDoyODZiNWI5Ni05YjI3LTRkNGUtODQ4NS1lYmU5MDJkOGI4MGMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QjY3NUEzRjhFOENBMTFFOTk5OTk5Q0ExMUQ1RDBCNDkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NDM0OGM5ZDQtYWMwYy04MDQ2LTkzNzAtOTI0MjEyZmQ2NGI3IiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE4IChXaW5kb3dzKSIgeG1wOkNyZWF0ZURhdGU9IjIwMTktMTAtMDdUMTQ6MjE6MzUrMDg6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDE5LTEwLTA3VDE0OjQ4OjQwKzA4OjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDE5LTEwLTA3VDE0OjQ4OjQwKzA4OjAwIiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIgcGhvdG9zaG9wOklDQ1Byb2ZpbGU9InNSR0IgSUVDNjE5NjYtMi4xIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MWM1NzBkMzgtZWJkMC1hNjQwLWI2MjQtMjdjNmM0NTRhMjZlIiBzdFJlZjpkb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6NDY3ZjUzMzgtNGFiZS1lZjQ0LTkyYmItMGZlM2RlZDA1NzNhIi8+IDx4bXBNTTpIaXN0b3J5PiA8cmRmOlNlcT4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjQzNDhjOWQ0LWFjMGMtODA0Ni05MzcwLTkyNDIxMmZkNjRiNyIgc3RFdnQ6d2hlbj0iMjAxOS0xMC0wN1QxNDo0ODo0MCswODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PotX7FYAAAFXSURBVFiFY3zuo8OAC/yw9avhOLypGVmMBZvCbx6xQiyPbx3gOLJZF10OQ8N3x5Bw9jN7FzK/ecaOzTC4hm8esSzMr59s4Di80Zvxz2+czmRhYGBg+O4aac529cR2lse3BXGqhGn4YeXdz3Fkcz7j9y+MhBQzMDAwMDH8/8/MwPCfGLUQDRzHt+X9sPGz/COr+p44GxgYGDh3Lz/5S9tC7Kex4zYGZqwhDQeM6BH33TEknO3yMZzByoQuwLl/zcqfJs5Sv7TNLzMwYoYDhg3I4Jeu9Um2y0fNkMXwJg22K8dGkwYDw2jSQIDRpIGuYTRpQMFo0kDXMJo0oGA0aaBrGE0aUDCaNNA1DIOkgaGBEBiNaeJsYBhsMT1aCBBSzMAwmjQwwWjSgILRpIEORpMGFIwmDXQwmjSgYDRpoIPRpAEFIzJpYO1wcO1Y/I7t6km9H9a+dehyAAOwB0KVKMquAAAAAElFTkSuQmCC");
        content: "";
        position: absolute;
        top: 0;
        left: -10px;
        width: 10px;
        height: 100%;
        background-size: 100% 100%;
      }



      .c {

        /*margin-left: 10px;*/
        height: 70px;
        font-size: 14px;
        color: white;
        line-height: 70px;
        text-align: center;
        background-color: #e74c2c;
        padding: 0 10px;


        /*.title {*/
        /*  font-size: 22px;*/

        /*  font-family: "Microsoft YaHei";*/

        /*  .money {*/

        /*    margin-left: 4px;*/
        /*    font-weight: 300;*/
        /*  }*/
        /*}*/
      }

      .r {
        float: right;
        height: 70px;
        width: 100px;
        position: absolute;
        right: 0px;
        top: 0;
        /*position: relative;*/
        background-size: 100% 100%;
        background-repeat: no-repeat;
        background-position: left center;
        background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGUAAABwCAYAAAAHZ77nAAAACXBIWXMAAAsTAAALEwEAmpwYAAAGCGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIiB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDoyODZiNWI5Ni05YjI3LTRkNGUtODQ4NS1lYmU5MDJkOGI4MGMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QjY4MjlDN0FFOENBMTFFOTk5OTk5Q0ExMUQ1RDBCNDkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NTNkNmEzZTEtMjBiMS1hMjRjLWI5ZTEtOGY0Y2IxZTBkZjYyIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE4IChXaW5kb3dzKSIg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');

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

  .style2 {
    /*margin: 0 10px 0;*/
    /*padding-top: 10px;*/

    /*height: 72px;*/
    width: 100%;
    overflow-x: scroll;
    overflow-y: hidden;
    white-space: nowrap;

    .item {
      display: inline-block;
      position: relative;
      height: 70px;
      margin-right: 6px;
      /*display: flex;*/
      font-size: 16px;
      background: white;

      &:before,&:after{
        background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAACECAYAAACklspSAAAACXBIWXMAAAsTAAALEwEAmpwYAAAGCGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIiB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDoyODZiNWI5Ni05YjI3LTRkNGUtODQ4NS1lYmU5MDJkOGI4MGMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QjY3NUEzRjhFOENBMTFFOTk5OTk5Q0ExMUQ1RDBCNDkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NDM0OGM5ZDQtYWMwYy04MDQ2LTkzNzAtOTI0MjEyZmQ2NGI3IiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE4IChXaW5kb3dzKSIgeG1wOkNyZWF0ZURhdGU9IjIwMTktMTAtMDdUMTQ6MjE6MzUrMDg6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDE5LTEwLTA3VDE0OjQ4OjQwKzA4OjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDE5LTEwLTA3VDE0OjQ4OjQwKzA4OjAwIiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIgcGhvdG9zaG9wOklDQ1Byb2ZpbGU9InNSR0IgSUVDNjE5NjYtMi4xIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MWM1NzBkMzgtZWJkMC1hNjQwLWI2MjQtMjdjNmM0NTRhMjZlIiBzdFJlZjpkb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6NDY3ZjUzMzgtNGFiZS1lZjQ0LTkyYmItMGZlM2RlZDA1NzNhIi8+IDx4bXBNTTpIaXN0b3J5PiA8cmRmOlNlcT4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjQzNDhjOWQ0LWFjMGMtODA0Ni05MzcwLTkyNDIxMmZkNjRiNyIgc3RFdnQ6d2hlbj0iMjAxOS0xMC0wN1QxNDo0ODo0MCswODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PotX7FYAAAFXSURBVFiFY3zuo8OAC/yw9avhOLypGVmMBZvCbx6xQiyPbx3gOLJZF10OQ8N3x5Bw9jN7FzK/ecaOzTC4hm8esSzMr59s4Di80Zvxz2+czmRhYGBg+O4aac529cR2lse3BXGqhGn4YeXdz3Fkcz7j9y+MhBQzMDAwMDH8/8/MwPCfGLUQDRzHt+X9sPGz/COr+p44GxgYGDh3Lz/5S9tC7Kex4zYGZqwhDQeM6BH33TEknO3yMZzByoQuwLl/zcqfJs5Sv7TNLzMwYoYDhg3I4Jeu9Um2y0fNkMXwJg22K8dGkwYDw2jSQIDRpIGuYTRpQMFo0kDXMJo0oGA0aaBrGE0aUDCaNNA1DIOkgaGBEBiNaeJsYBhsMT1aCBBSzMAwmjQwwWjSgILRpIEORpMGFIwmDXQwmjSgYDRpoIPRpAEFIzJpYO1wcO1Y/I7t6km9H9a+dehyAAOwB0KVKMquAAAAAElFTkSuQmCC");
        content: "";
        position: absolute;
        top: 0;
        width: 10px;
        height: 100%;
        background-size: 100% 100%;
      }

      &:after{
        right: 0;
        transform: rotateY(180deg);
      }

      .c {
        font-size: 14px;
        text-align: center;
        line-height: 70px;
        color: #555;
        background-color: #e74c2c ;
        color: white;
        margin: 0 10px;
        padding: 0 10px;


        .title {
          font-family: "Microsoft YaHei";
          .money {
            margin-left: 4px;
            font-weight: 300;
          }
        }
      }


    }
  }

  .style1block {
    /*height: 72px;*/
    width: 100%;
    overflow-x: scroll;
    overflow-y: hidden;
    white-space: nowrap;

    .item {
      height: 70px;
      box-sizing: border-box;
      overflow: hidden;
      text-align: center;
      font-size: 14px;
      display: inline-block;
      margin-right: 6px;
      background: #e74c2c;
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

  .style1flex{
    height: 72px;
    width: 100%;
    display: flex;

    .item {
      flex: 1;
      height: 72px;
      box-sizing: border-box;

      text-align: center;
      font-size: 14px;
      margin-right: 10px;
      background: #e74c2c;
      color: white;
      padding: 6px 20px;

      &:last-child{
        margin-right: 0;
      }

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
