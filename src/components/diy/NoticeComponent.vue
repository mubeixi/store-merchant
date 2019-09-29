<template>
  <div @click.stop="setData({}, 0)" class="notice wrap">
    <div class="inner-container">
      <transition class="inner-container2" name="slide" mode="out-in">
        <div class="text2" :key="text.id"><span class="tip"><i class="el-icon-bell"/></span>
          <div class="content">{{text.val}}</div>
        </div>
      </transition>
      <!--      <p class="text" v-for="(text, index) in notice.value.list" :key="index">{{text}}</p>-->
    </div>
  </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {mapState} from 'vuex';
    import Notice from '@/assets/js/diy/notice';
    import {deepCopy, deepCopyStrict} from '@/common/utils';

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
                number: 0,
                notice: {},
            };
        },
        computed: {
            style() {
                return deepCopyStrict(this.notice.styleDefault, this.notice.style);
            },
            activeAttr: {
                get() {
                    return this.$store.state.activeAttr;
                },
                set(nval) {

                },
            },
            text() {
                return {
                    id: this.number,
                    val: this.notice.value.list[this.number]
                }
            },
            ...mapState(['editStatus']),
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
            startMove() {
                let _self = this;
                setTimeout(function () {
                    if (_self.number === _self.notice.value.list.length - 1) {
                        _self.number = 0;
                    } else {
                        _self.number += 1;
                    }
                    _self.startMove();
                }, 2000)
            },
            setData(item, index) {
                // console.log('hehe',this.hr)
                this.$store.commit('activeAttr', this.notice);// 这里点击之后，setAttr马上就有响应。
                this.$store.commit('tabIndex', this.index);

                // 用vuex就不要一层层传递了，头都晕了
                // this.$emit('setData', this.img.attrData)
            },
            // ...mapActions(),
        },
        mounted() {
            this.$nextTick().then(res => {
                this.startMove()
            })
        }

    })
    export default class NoticeComponent extends Vue {
        created() {
            //用这个来搞事啊
            //funvm也是vue实例，而且不是根实例，是这个组件的实例，可以快捷的调用组件中的对象或者方法以及$ref
            Notice.prototype.funvm = this;
            //Notice.prototype.vm = this;
            this.$store.commit('tabIndex', this.index);// 设置tabIndex，等于templData是二维数组，这个是二维数组的
            this.notice = deepCopy(new Notice(), this.data);
        }

    }
</script>

<style scoped lang="less">
  .slide-enter-active, .slide-leave-active {
    transition: all 0.5s linear;
  }

  .slide-leave-to {
    opacity: 0.1;
    transform: translateY(-20px);
  }

  .slide-enter {

    transform: translateY(20px);
  }

  .inner-container {
    height: 36px
  }

  .text2 {
    display: flex;
    overflow: hidden;

    line-height: 36px;
    font-size: 14px;
  }

  .tip {
    padding: 0 10px;

  }

  .content {
    flex: 1;
    text-overflow: ellipsis;
  }

  .wrap {
    background: white;
  }


</style>
