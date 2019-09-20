<template>
  <div @click.stop="setData({}, 0)" :style="{paddingTop:style.margin+'px',paddingBottom:style.margin+'px'}">
    <div :style="{borderBottomWidth:style.height+'px',borderBottomColor:style.color,borderBottomStyle:hr.config.type}" class="hr"></div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Hr from "@/assets/js/diy/hr";
import {mapState,mapActions,mapMutations} from "vuex";
import {deepCopyStrict,deepCopy} from "@/common/utils";

@Component({
    props:{
        index:{
          required:true
        },
        data: {
            type: Object,
            default: () => ({})
        },
    },
    data(){
      return {
          hr:{}
      }
    },
    computed:{
        style() {
            return deepCopyStrict(this.hr.styleDefault,this.hr.style)
        },
        activeAttr:{
            get(){
                return this.$store.state.activeAttr
            },
            set(nval){

            }
        },
      ...mapState(['editStatus'])
    },
    watch:{
        //属性变化
        activeAttr:{
            deep:true,
            handler(val){

            }
        }
    },
    components: {

    },
    methods:{
        setData(item, index) {

            console.log('hehe',this.hr)
            this.$store.commit('activeAttr',this.hr);//这里点击之后，setAttr马上就有响应。


            //用vuex就不要一层层传递了，头都晕了
            //this.$emit('setData', this.img.attrData)
        },
        // ...mapActions(),
    },
    created(){
        this.$store.commit('tabIndex',this.index);//设置tabIndex，等于templData是二维数组，这个是二维数组的
        this.hr = deepCopy(new Hr(this),this.data)
    }
})
export default class HrComponent extends Vue {









}
</script>

<style scoped lang="stylus">
.hr
  height 0
  width 100%
</style>
