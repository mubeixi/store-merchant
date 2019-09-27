<template>
<div class="wrap">
  <div class="box" :style="{width:W+'px',height:W+'px'}">
    <div v-for="(row,idx1) in CTX.row" class="row" :style="{height:colWH+'px'}">
      <div
        @click="colClick(idx1,idx2)"
        v-on:mouseenter="changeActive(idx1,idx2)"
        v-for="(row,idx2) in CTX.row"
        class="column text-center"

        :style="{width:colWH+'px',height:colWH+'px',lineHeight:colWH+'px'}">
        <!--          {{idx1+'—'+idx2}}-->
      </div>
    </div>

    <!--所有热区用绝对定位实现-->
    <div class="active"  @click="activeArea(aidx,area)" :class="areaActiveIndxx===aidx?'act':''" :style="[getAreaStyle(area)]" v-for="(area,aidx) in CTX.selects">
      <div class="mask" :style="{backgroundImage:'url('+area.bgimg||''+')'}"></div>
      <i class="el-icon-error delicon" @click="delArea(area)" />
    </div>
  </div>

<!--  <div style="position: absolute;right: 20px;top: 20px;" v-show="currentArea">-->
<!--    <upload-img-components class="myUploadImg" :onSuccess='uploadImgCB'-->
<!--                           type='avatar'-->
<!--    ></upload-img-components>-->
<!--  </div>-->

</div>
</template>

<script>

import MagicCube from "@/assets/js/diy/tool/MagicCube";

import {domain} from '@/common/utils';


export default {
  name:'MagicCubeComponent',
  data(){
    return {
      CTX:null,
      currentArea:null,
      areaActiveIndxx:null,
      isDrag:false,//标记是否点击了一次
      row_idx:null,//行序列1
      col_idx:null,//竖直序列1
      row_idx1:null,//行序列2
      col_idx1:null//竖直序列2
    }
  },
  components:{
    // uploadImgComponents
  },
  computed:{
    W(){
      return this.CTX.width
    },
    colWH(){
      return this.CTX.width/this.CTX.row
    }
  },
  methods:{
    domainFunc(url){
      console.log(url)
      return domain(url)
    },
    uploadImgCB(res){
      console.log(res.data.path)
      if(!res.data.path)return;
      if(!this.currentArea)return;

      this.$set(this.currentArea,'bgimg',domain(res.data.path))//不这样数据装死不动


    },
    activeArea(idx,area){
      this.areaActiveIndxx = idx;
      this.currentArea = area;
    },
    dragSelect(){

    },
    delArea(area){
      this.CTX.del_selects(area)
      this.clearIdx()
    },
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
    colClick(idx1,idx2){
      console.log(idx1,idx2)
      if(!this.isDrag){
        console.log('赋值给第1个')
        this.row_idx = idx1;
        this.col_idx = idx2;
        this.isDrag = true;
        return;
      }


      if(this.isDrag){

        //同一个区块点两次，也取消掉
        if(this.row_idx === idx1 && this.col_idx === idx2){
          this.isDrag = false;
          return;
        }

        console.log('赋值给第二个')
        this.row_idx1 = idx1;
        this.col_idx1 = idx2;
        this.isDrag = false;

        //分别获取最小的x和y的取值范围
        let y = Math.min(this.row_idx1,this.row_idx);
        let y1 = Math.max(this.row_idx1,this.row_idx);//需要多数一格

        let x = Math.min(this.col_idx1,this.col_idx);
        let x1 = Math.max(this.col_idx1,this.col_idx);//需要多数一格

        //大的数值加1
        y1++;
        x1++;

        //创建矩形试试
        //let tempArea = getAreaPoint(x,y,x1,y1,this.colWH);

        //需要乘以单元格的长度，获得实际像素
        let createRT = this.CTX.create_area(x,y,x1,y1)

        createRT && this.dragSelect(x,y,x1,y1)


        this.currentArea = this.CTX.selects[this.CTX.selects.length-1];//新增的话，就把最新的给他


      }



    },
    changeActive(idx1,idx2){

      //
      // if(!isNum(this.row_idx) || !isNum(this.col_idx)){
      //   console.log('赋值给第1个')
      //   this.row_idx = idx1;
      //   this.col_idx = idx2;
      //   return;
      // }

      // //第一次给idx,第二次给idx2
      // console.log('赋值给第二个')
      // this.row_idx1 = idx1;
      // this.col_idx1 = idx2;


    },
    clearIdx(){
      this.row_idx = null;
      this.col_idx = null;
      this.row_idx1 = null;
      this.col_idx1 = null;
    },
  },
  created() {

    this.CTX = new MagicCube(7,540);
    window.CTX = this.CTX;
  }
}
</script>

<style lang="less" scoped>
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
    margin: 20px;
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
