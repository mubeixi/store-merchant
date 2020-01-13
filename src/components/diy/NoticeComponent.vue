<template>
  <div @click.stop="setData({}, 0)" class="notice wrap">

    <div class="flex content" :style="{background:notice.style.bgColor}">
<!--      <svg class="fun-icon icon" :style="{color:notice.style.iconColor}"  aria-hidden="true">-->
<!--        <use xlink:href="#icon-gonggao" ></use>-->
<!--      </svg>-->
      <i :style="{color:notice.style.iconColor}" class="el-icon-message-solid"></i>

      <div class="flex1 title"  :style="{color:notice.style.color}">

        <span :style="{marginLeft: marginLeft + 'px'}">{{notice.value.content}}</span>
      </div>

    </div>
    <span class="fun-plugin-tag">公告</span>
  </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {mapState} from 'vuex';
    import Notice from '@/assets/js/diy/notice';
    import {deepCopy, mixinStyle} from '@/common/utils';

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
                time:100,
                marginLeft:0,
                an:null,
                notice: {},
                fullWidth:0
            };
        },
        computed: {
            // style() {
            //     return mixinStyle(this.notice.styleDefault, this.notice.style);
            // },
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
            notice:{
                deep:true,
                handler(val){
                    console.log(342423)
                }
            }
        },
        components: {},
        methods: {
            startAn: function(){ // 开始
                let _self:any = this;
                let width = document.getElementById('canvas').offsetWidth-30;

                _self.fullWidth = width

                _self.an = setInterval( ()=>{
                    if (_self.marginLeft*(-1) > width) {
                        _self.marginLeft = _self.fullWidth;
                    }
                    _self.marginLeft -= 2;
                } , _self.time);
            },
            stopAn: function(){ // 停止
                this.prevLeft = this.marginLeft;
                this.marginLeft = this.fullWidth;
                clearInterval(this.an);

            },
            pauseAn: function(){ // 暂停动画
                clearInterval(this.an);
            },
            itemClick: function( item, e ) {

            },

            // startMove() {
            //     let _self = this;
            //     setTimeout(function () {
            //         if (_self.number === _self.notice.value.list.length - 1) {
            //             _self.number = 0;
            //         } else {
            //             _self.number += 1;
            //         }
            //         _self.startMove();
            //     }, 2000)
            // },
            setData(item, index) {
                // console.log('hehe',this.hr)
                // @ts-ignore
                this.$store.commit('activeAttr', this.notice);// 这里点击之后，setAttr马上就有响应。
                // @ts-ignore
                this.$store.commit('tabIndex', this.index);

                // 用vuex就不要一层层传递了，头都晕了
                // this.$emit('setData', this.img.attrData)
            },
            // ...mapActions(),
        },
        mounted() {
            // this.$nextTick().then(res => {
            //     this.startMove()
            // })
        }

    })
    export default class NoticeComponent extends Vue {
        created() {
            //用这个来搞事啊
            //funvm也是vue实例，而且不是根实例，是这个组件的实例，可以快捷的调用组件中的对象或者方法以及$ref
            // @ts-ignore
            Notice.prototype.funvm = this;
            //Notice.prototype.vm = this;
            // @ts-ignore
            this.$store.commit('tabIndex', this.index);// 设置tabIndex，等于templData是二维数组，这个是二维数组的
            // @ts-ignore
            this.notice = deepCopy(new Notice(), this.data);
            //重新绑定attrData.content，让修改可以同步到其他地方
            this.notice.setIndex(0,{value:false,config:false})


            this.$nextTick(function(){
                this.startAn();
            })

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

  .content{
    padding: 6px 10px;
  }


  .icon{
    font-size: 20px;
    margin-right: 10px;
    /*color: #ff732e;*/
  }

  .title{
    color: #666;
    font-size: 14px;
    height: 20px;
    line-height: 20px;
    overflow: hidden;
    /*white-space: nowrap;*/
  }


</style>
