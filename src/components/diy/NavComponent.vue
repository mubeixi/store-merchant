<template>
  <div @click.stop="setData({}, 0)" class="nav wrap" :style="{background:style.bgColor}">
    <div class="box" :class="[className]" :style="{color:style.color}">
      <ul class="list" :class="displayStyle" :style="{display:nav.value.list.length<6?'flex':'block'}">
        <li v-for="(item,idx) in nav.value.list" class="item"
            :style="{flex:nav.value.list.length<6?'1':''}">
          <div v-show="nav.config.type===1" class="cover"
               :style="{backgroundImage:'url('+domainFunc(item.img)+')'}">
          </div>
          <div class="title" >{{item.title}}</div>
        </li>
      </ul>
    </div>
    <span class="fun-plugin-tag">图文导航</span>
  </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {mapState} from 'vuex';
    import Nav from '@/assets/js/diy/nav';
    import {deepCopy, domain} from '@/common/utils';
    import {mixinStyle} from '@/common/utils';

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
        //这个data只用在从数据库获取配置后，初始化的时候用一次。主要是吧config/value/list
        //或者是组件第一次创建的时候，生成的默认值config/value/list。所以不用担心在created里面data会无脑覆盖new Nav实例的属性值（覆盖也不碍事，因为都是空白对象创建的，本来就是一模一样）。
        data() {
            return {
                nav: {},
            };
        },
        computed: {
            displayStyle(){
                return this.nav.value.list.length<6?'isflex':'isblock'
            },
            className() {
                return 'style1';//+this.nav.config.style
            },
            style() {

                return mixinStyle(this.nav.styleDefault,this.nav.style)
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

                let _self = this;

                //这里又关联上了。因为这里一边动，那边templData会因为preview的watch事件而改变（关联引用)....所以需要切断


                //这里只能是引用传值，因为setAttr里面有需要用到方法
                // @ts-ignore
                this.$store.commit('activeAttr', this.nav);// 这里点击之后，setAttr马上就有响应。

                // @ts-ignore
                this.$store.commit('tabIndex', this.index);

                // 用vuex就不要一层层传递了，头都晕了
                // this.$emit('setData', this.img.attrData)
            },
            // ...mapActions(),
        },

    })
    export default class NavComponent extends Vue {
        created() {
            console.log(111111111)
            //用这个来搞事啊
            //funvm也是vue实例，而且不是根实例，是这个组件的实例，可以快捷的调用组件中的对象或者方法以及$ref
            Nav.prototype.funvm = this;

            this.$store.commit('tabIndex', this.index);// 设置tabIndex，等于templData是二维数组，这个是二维数组的


            let navObj = new Nav();
            //因为是直接申请在类里面的，所以不是原型链的传递
            //方法是通过原型链传递，所以之类不会遍历几类的方法

            // Basis.prototype.vm = Vue; //基类原型链上的属性
            console.log(navObj, this.data);

            //这里的nav只做展示，所以这里面的值应该是要随着data变化而变化

            //这里虽然不是通过prop机制生效，但是因为引用传递，所以this.data一变化，那么nav也会变化

            //已经剪断了this.data和this.nav的关系。

            //这里只修改了NavObj的value,config.value的值，其他都没做过了。
            this.nav = deepCopy(navObj, this.data);

            //重新绑定attrData.content，让修改可以同步到其他地方
            this.nav.setIndex(0,{value:false,config:false})


            // this.nav = Object.assign(navObj,this.data)
            // console.log(this.nav)
            // console.log(Object.assign({},navObj), Object.assign({},this.data));
        }
    }
</script>

<style scoped lang="less">
  @import "~@/assets/css/fun.less";

  ul, li {
    .rest;

  }

.wrap{

  padding: 0 10px;
}
  .box {
    .list {

      .item {

        text-align: center;
        cursor: pointer;
        .cover {
          background: #f2f2f2;
          .cover-full-bg(contain, 0, none);

          width: 36px;
          height: 36px;
          margin: 6px auto;
        }

        .title {
          height: 22px;
          line-height: 22px;
          text-align: center;
          font-size: 14px;
          /*color: #444;*/
        }
      }
    }
  }

  .style1 {

    .list {

      &.isflex{
        .item{
          .cover{
            /*width: 44px;*/
            /*height: 44px;*/
          }
        }
      }
      &.isblock{
        white-space: nowrap;
        overflow-x: scroll;
        .item{
          margin-right: 15px;
          padding: 0 6px;
        }
      }


      ::-webkit-scrollbar {
        display: none;
      }

      .item {
        display: inline-block;
        /*height: 70px;*/
        overflow-y: hidden;
        /*max-width: 50px;*/
        .title{
          overflow-y: hidden;
          /*text-overflow: ellipsis;*/
        }
      }
    }
  }

</style>
