<template>
  <div @click.stop="setData({}, 0)"  class="search wrap" :style="{backgroundColor:search.style.bgColor}">
    <div class="box" :class="{'round':search.config.type==='round'}" >
      <i class="el-icon-search icon"></i>
      <input class="input"
             :style="{height:search.style.height+'px',backgroundColor:search.style.inputBgColor,color:search.style.color}"
             :placeholder="search.value.hot|placeholderStr" />
<!--      <el-input  clearable size="small"  prefix-icon="el-icon-search" :placeholder="search.config.hot|placeholderStr" />-->
    </div>
  </div>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import Search from "@/assets/js/diy/search";
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
                search:{}
            }
        },
        computed:{
            style() {
                return deepCopyStrict(this.search.styleDefault,this.search.style)
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
        filters:{
          placeholderStr:function(hot){
              let str = hot.join(' ');
              if(str) return str;
              return '请输入内容'
          }
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

                //console.log('hehe',this.search)
                this.$store.commit('activeAttr',this.search);//这里点击之后，setAttr马上就有响应。


                this.$store.commit('tabIndex',this.index)

                //用vuex就不要一层层传递了，头都晕了
                //this.$emit('setData', this.img.attrData)
            },
            // ...mapActions(),
        },

    })
    export default class SearchComponent extends Vue {

        created(){
            Search.prototype.vm = this;
            this.$store.commit('tabIndex',this.index);//设置tabIndex，等于templData是二维数组，这个是二维数组的
            this.search = deepCopy(new Search(this),this.data)
        }




    }
</script>

<style scoped lang="less">
  .wrap{
    width: 100%;
    padding: 10px 0;
    .box{
      margin: 0 15px;
      position: relative;
      .input{
          width: 100%;
          box-sizing: border-box;
          border:1px solid #DCDFE6;
          padding: 0 30px;
          &::placeholder{
            color: #999;
          }
      }
      .icon{
        position: absolute;
        top: 50%;
        width: 30px;
        transform: translateY(-50%);
        -webkit-transition: all .3s;
        text-align: center;
        color: #C0C4CC;
      }
    }
    .round{
      .input{
        border-radius: 4px;
      }
    }
  }


</style>
