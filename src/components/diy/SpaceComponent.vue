<template>
  <div @click.stop="setData({}, 0)"
       :style="{height:style.height+'px',background:style.bgColor}" class="space">
    <span class="fun-plugin-tag">间隔</span>
  </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {mapState} from 'vuex';
    import Space from '@/assets/js/diy/space';
    import {deepCopy, deepCopyStrict,mixinStyle} from '@/common/utils';

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
                space: {},
            };
        },
        computed: {
            style() {
                return mixinStyle(this.space.styleDefault, this.space.style);
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
                // console.log('hehe',this.space)
                // @ts-ignore
                this.$store.commit('activeAttr', this.space);// 这里点击之后，setAttr马上就有响应。


                // @ts-ignore
                this.$store.commit('tabIndex', this.index);

                // 用vuex就不要一层层传递了，头都晕了
                // this.$emit('setData', this.img.attrData)
            },
            // ...mapActions(),
        },

    })
    export default class SpaceComponent extends Vue {
        created() {
            //用这个来搞事啊
            //funvm也是vue实例，而且不是根实例，是这个组件的实例，可以快捷的调用组件中的对象或者方法以及$ref
            Space.prototype.funvm = this;
            //console.log(4444);
            this.$store.commit('tabIndex', this.index);// 设置tabIndex，等于templData是二维数组，这个是二维数组的
            this.space = deepCopy(new Space(this), this.data);
            //重新绑定attrData.content，让修改可以同步到其他地方
            this.space.setIndex(0,{value:false,config:false})
        }
    }
</script>

<style scoped lang="stylus">
  .space
    height 0
    width 100%
</style>
