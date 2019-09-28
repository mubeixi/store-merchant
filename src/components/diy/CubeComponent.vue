<template>
  <div @click.stop="setData({}, 0)"  class="cube wrap" >
    <div class="box" :style="{width:W+'px',height:W+'px'}">
<!--      <div v-for="(row,idx1) in cube.value.list" class="row" :style="{height:colWH+'px'}">-->
<!--        <div-->
<!--          @click="colClick(idx1,idx2)"-->
<!--          v-on:mouseenter="changeActive(idx1,idx2)"-->
<!--          v-for="(row,idx2) in CTX.row"-->
<!--          class="column text-center"-->

<!--          :style="{width:colWH+'px',height:colWH+'px',lineHeight:colWH+'px'}">-->
<!--          &lt;!&ndash;          {{idx1+'—'+idx2}}&ndash;&gt;-->
<!--        </div>-->
<!--      </div>-->

      <!--所有热区用绝对定位实现-->
      <div class="active" :data-idx="area.IDX"    :style="[getAreaStyle(area)]" v-for="(area,aidx) in cube.value.list">
        <div class="mask" :style="{backgroundImage:'url('+domainFunc(area.bgimg)||''+')'}"></div>
<!--        <pre>{{area}}</pre>-->
<!--        <i class="el-icon-error delicon" @click.stop="delArea(area)" />-->
      </div>
    </div>






  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { mapState, mapActions, mapMutations } from 'vuex';
import Cube from '@/assets/js/diy/cube';
import { deepCopyStrict, deepCopy,domain } from '@/common/utils';
import MagicCube from '@/assets/js/diy/tool/MagicCube';

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
        cube: {},
        CTX:{}
    };
  },
  computed: {
    W(){
        let ele = document.getElementById('canvas');
        if(ele){
            return ele.offsetWidth;
        }else{
            return 375;
        }
    },
    colWH(){
        return this.W/this.cube.config.row
    },
    className(){
        return 'style1';//+this.nav.config.style
    },
    style() {
      // return deepCopyStrict(this.coupon.styleDefault, this.coupon.style);
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
    str2num(val){
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
  components: {

  },
  methods: {
    getAreaStyle(area){
        let styleObj = {
            left:area.x*this.colWH+'px',
            top:area.y*this.colWH+'px',
            width:(area.x1-area.x)*this.colWH+'px',
            height:(area.y1-area.y)*this.colWH+'px',
        };
        // if(area.bgimg){
        //   console.log(333)
        //   styleObj.backgroundImage = 'url('+domain(area.bgimg)+')';
        // }
        return styleObj
    },
    domainFunc(url){
        return domain(url)
    },
    setData(item, index) {
      // console.log('hehe',this.search)
      this.$store.commit('activeAttr', this.cube);// 这里点击之后，setAttr马上就有响应。

      this.$store.commit('tabIndex', this.index);

      // 用vuex就不要一层层传递了，头都晕了
      // this.$emit('setData', this.img.attrData)
    },
    // ...mapActions(),
  },

})
export default class CubeComponent extends Vue {
  created() {
    Cube.prototype.vm = this;
    this.$store.commit('tabIndex', this.index);// 设置tabIndex，等于templData是二维数组，这个是二维数组的
    this.cube = deepCopy(new Cube(), this.data);

    this.CTX = this.cube;

  }
}
</script>

<style scoped lang="less">
@import "~@/assets/css/fun.less";
@import "~@/assets/css/fun.less";

.active{
  position: absolute;
  .mask{
    .cover-full-bg(cover,0,white);
    position: absolute;
    left:1px;
    bottom:1px;
    right: 1px;
    top:1px;
    background-color: white;
  }

  &.act{
    border: 1px rgba(63,142,243,1) solid;
    .delicon{
      visibility: visible;
    }
  }

  box-sizing: border-box;
  border: 1px rgba(40,95,165,0.1) solid;

  background: rgba(63,142,243,0.1);
  box-sizing: border-box;
  /*z-index: 2;*/
  &:hover{
    .delicon{
      visibility: visible;
    }
  }
  .delicon{
    visibility: hidden;
    position: absolute;
    font-size: 20px;
    right: -10px;
    top: -10px;
    z-index: 339;
    cursor: pointer;
    color: #66b1ff;
    &:hover{
      color: #409eff;
    }
  }
}

.box{
  margin-bottom: 15px;
  position: relative;
  .border();
  /*box-sizing: border-box;*/
  .row{
    /*box-sizing: border-box;*/

    .column{
      display: inline-block;
      box-sizing: border-box;
      &:last-child{
        .border-right(0px);
      }
      .border-right();
      .border-bottom();
    }

    &:last-child{
      .column{
        .border-bottom(0px);
      }
    }
  }
}
</style>
