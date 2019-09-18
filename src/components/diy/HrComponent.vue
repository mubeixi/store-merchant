<template>
  <div @click.stop="setData({}, 0)" :style="{paddingTop:data.config.style.margin+'px',paddingBottom:data.config.style.margin+'px'}">
    <div :style="{borderBottomHeight:data.config.style.height+'px',borderBottomColor:data.config.style.color,borderBottomStyle:data.config.type}" class="hr"></div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Hr from "@/assets/js/diy/hr";
import {mapState,mapActions,mapMutations} from "vuex";
import {deepCopy} from "@/common/utils";

@Component({
    props:{
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

    },
    components: {

    },
    methods:{
        setData(item, index) {
            console.log('hehe',this.hr)

            this.$store.commit('activeAttr',this.hr)
            //用vuex就不要一层层传递了，头都晕了
            //this.$emit('setData', this.img.attrData)
        },
        // ...mapActions(),
    }
})
export default class HrComponent extends Vue {



    created(){
        console.log(new Hr(),this.data)
        this.hr = deepCopy(new Hr(),this.data)
    }





}
</script>

<style scoped lang="stylus">
.hr
  height 0
  width 100%
</style>
