<template>
  <div @click.stop="setData({}, 0)" class="title"
       :style="{color:title.style.color,backgroundColor:title.style.bgColor}">
    <!--    :class="{islink:title.value.link?1:0}"-->
    <div class="text">{{title.value.title}}</div>
    <div class="small">{{title.value.small}}</div>

    <span class="more">{{moreData.title}}</span>
  </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {mapState} from 'vuex';
    import Title from '@/assets/js/diy/title';
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
                return deepCopyStrict(this.title.styleDefault, this.title.style);
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
            setData(item, index) {
                // console.log('hehe',this.hr)
                this.$store.commit('activeAttr', this.title);// 这里点击之后，setAttr马上就有响应。
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
        }
    }
</script>

<style scoped lang="stylus">

  .title
    position relative
    width 100%

    .text
      font-size 18px

    /*color #333*/

    .small
      font-size 14px

    /*color #666*/

    .more
      position absolute
      right 10px
      top 10px
      font-size 12px
      color #66b1ff

</style>
