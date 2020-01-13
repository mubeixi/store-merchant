<template>
  <div @click.stop="setData({}, 0)" class="text">
    <div :class="{islink:text.value.link?1:0}"
         :style="{fontSize:text.style.fontSize+'px',color:text.style.color,background:text.style.bgColor,textAlign:text.style.textAlign}"
         class="text">{{text.value.content}}
    </div>
    <span class="fun-plugin-tag">文字组件</span>
  </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {mapState} from 'vuex';
    import Text from '@/assets/js/diy/text';
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
                text: {},
            };
        },
        computed: {
            style() {
                return mixinStyle(this.text.styleDefault, this.text.style);
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
                // @ts-ignore
                this.$store.commit('activeAttr', this.text);// 这里点击之后，setAttr马上就有响应。

                // @ts-ignore
                this.$store.commit('tabIndex', this.index);

                // 用vuex就不要一层层传递了，头都晕了
                // this.$emit('setData', this.img.attrData)
            },
            // ...mapActions(),
        },

    })
    export default class TextComponent extends Vue {
        created() {
            //用这个来搞事啊
            //funvm也是vue实例，而且不是根实例，是这个组件的实例，可以快捷的调用组件中的对象或者方法以及$ref
            Text.prototype.funvm = this;
            //Text.prototype.vm = this;
            this.$store.commit('tabIndex', this.index);// 设置tabIndex，等于templData是二维数组，这个是二维数组的
            this.text = deepCopy(new Text(this), this.data);
            //重新绑定attrData.content，让修改可以同步到其他地方
            this.text.setIndex(0,{value:false,config:false})
        }
    }
</script>

<style scoped lang="stylus">
  .text
    width 100%
</style>
