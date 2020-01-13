<template>
  <div @click.stop="setData({}, 0)" class="title"
       :style="{color:title.style.color,background:title.style.bgColor,paddingLeft:title.style.padding+'px',paddingRight:title.style.padding+'px',paddingTop:title.style.paddingc+'px',paddingBottom:title.style.paddingc+'px'}">
    <!--    :class="{islink:title.value.link?1:0}"-->
    <div class="flex">
      <img class="icon" :style="{marginRight:10+'px'}" :src="domainFunc(title.config.icon)" />
      <div class="flex1" :style="{textAlign:title.style.textAlign}">
        <div class="text" :style="{fontSize:title.style.fontSize+'px'}">{{title.value.title}}</div>
        <div class="small"  :style="{fontSize:title.style.fontSize-4+'px'}">{{title.value.small}}</div>
      </div>
    </div>

    <span class="more">{{moreData.title}}</span>
    <span class="fun-plugin-tag">标题</span>
  </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {mapState} from 'vuex';
    import Title from '@/assets/js/diy/title';
    import {deepCopy,mixinStyle} from '@/common/utils';
    import {domain} from '@/common/utils';

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
                title: {},
            };
        },
        computed: {
            moreData() {

                return this.title.value.more[0] || {};
                // if(!this.title || !this.title.value || !this.title.value.more)return {};
                // return this.title.value.more[0];//this.title.value?this.title.value.more[0]:{}
            },
            style() {
                return mixinStyle(this.title.styleDefault, this.title.style);
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
            domainFunc(url){
                return domain(url)
            },
            setData(item, index) {
                // console.log('hehe',this.hr)
                // @ts-ignore
                this.$store.commit('activeAttr', this.title);// 这里点击之后，setAttr马上就有响应。
                // @ts-ignore
                this.$store.commit('tabIndex', this.index);

                // 用vuex就不要一层层传递了，头都晕了
                // this.$emit('setData', this.img.attrData)
            },
            // ...mapActions(),
        },

    })
    export default class TitleComponent extends Vue {
        created() {
            //用这个来搞事啊
            //funvm也是vue实例，而且不是根实例，是这个组件的实例，可以快捷的调用组件中的对象或者方法以及$ref
            Title.prototype.funvm = this;
            //Title.prototype.vm = this;
            this.$store.commit('tabIndex', this.index);// 设置tabIndex，等于templData是二维数组，这个是二维数组的
            this.title = deepCopy(new Title(this), this.data);
            //重新绑定attrData.content，让修改可以同步到其他地方
            this.title.setIndex(0,{value:false,config:false})
        }
    }
</script>

<style scoped lang="stylus">

  .flex{
    align-items:center;
  }
  .icon{
    max-width 40px;
  }
  .title
    position relative
    /*width 100%*/

    .text
      //font-size 18px

    /*color #333*/

    .small
      opacity 0.8
      //font-size 14px

    /*color #666*/

    .more
      position absolute
      right 10px
      top 50%
      transform translateY(-50%)
      font-size 12px
      color #66b1ff

</style>
