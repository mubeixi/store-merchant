<template>
  <div class="wrap">
    <div class="box" :style="{width:W+'px',height:W+'px'}" @mouseleave="leaveBox" @mouseenter="enterBox">
      <div v-for="(row,idx1) in CTX.row" class="row" :style="{height:colWH+'px'}">
        <div
          @click="colClick(idx1,idx2)"
          v-on:mouseenter="changeActive(idx1,idx2)"
          @mouseenter="enter(idx1,idx2)" @mouseleave="leave()"
          v-for="(row,idx2) in CTX.row"
          class="column text-center"
          :style="{width:colWH+'px',height:colWH+'px',lineHeight:colWH+'px'}">
          <!--          {{idx1+'—'+idx2}}-->
        </div>
      </div>

      <!--所有热区用绝对定位实现-->
      <div  class="active" @click="activeArea(aidx,area)" :class="areaActiveIndxx===aidx?'act':''"
           :style="[getAreaStyle(area)]" v-for="(area,aidx) in CTX.selects">
        <div class="mask" :style="{backgroundImage:'url('+area.bgimg||''+')'}"></div>
        <span class="tip" v-show="!area.bgimg">{{getTip(area)}}</span>
<!--        <img src="@/assets/img/icon-del.png" class="delicon" />-->
        <i class="el-icon-error delicon" @click="delArea(area)"/>
<!--        <svg class="fun-icon icon delicon" @click="delArea(area)" aria-hidden="true">-->
<!--          <use xlink:href="#icon-del"></use>-->
<!--        </svg>-->
      </div>

      <div v-show="mouseInBox" class="hover"  :style="[getAreaStyle(tempAreaObj)]" >
        <div class="mask" ></div>
      </div>
    </div>

    <div style="position: absolute;right: 20px;top: 20px;" v-show="currentArea">
      <upload-img-components class="myUploadImg" :onSuccess='uploadImgCB'
                             type='avatar'
      ></upload-img-components>
    </div>

  </div>
</template>

<script>
  import MagicCube from '@/assets/js/diy/tool/MagicCube';
  import uploadImgComponents from '@/components/common/uploadImgComponents';
  import { domain } from '@/common/utils';

  function isNum(value) {
    return typeof value === 'number' && !isNaN(value);
  }

  function getAreaPoint(row_idx, col_idx, row_idx1, col_idx1, scale) {
    return {
      x: row_idx * scale,
      y: col_idx * scale,
      x1: row_idx1 * scale,
      y1: col_idx1 * scale
    };
  }


  export default {
    name: 'Hello',
    data() {
      return {
        CTX: null,
        mouseInBox:false,
        currentArea: null,
        tempAreaObj:{x:null,y:null,x1:null,y1:null},
        tempArea:{
          row_idx: null,//行序列1
          col_idx: null,//竖直序列1
          row_idx1: null,//行序列2
          col_idx1: null//竖直序列2
        },
        isTempDrag:false,
        areaActiveIndxx: null,
        isDrag: false,//标记是否点击了一次
        row_idx: null,//行序列1
        col_idx: null,//竖直序列1
        row_idx1: null,//行序列2
        col_idx1: null//竖直序列2
      };
    },
    components: {
      uploadImgComponents
    },
    computed: {
      W() {
        return this.CTX.width;
      },
      colWH() {
        return this.CTX.width / this.CTX.row;
      }
    },
    watch:{
      tempArea:{
        immediate:true,
        deep:true,
        handler(val){
          console.log(val)
        }
      }
    },
    methods: {
      enterBox(){
        this.mouseInBox = true
      },
      leaveBox(){
        // this.clearTempArea()
        this.mouseInBox =false

      },
      /**
       * 清理
       */
      clearTempArea(){
        this.tempArea = {
          row_idx: null,//行序列1
          col_idx: null,//竖直序列1
          row_idx1: null,//行序列2
          col_idx1: null//竖直序列2
        }

        this.tempAreaObj = {x:null,y:null,x1:null,y1:null}

        this.isTempDrag = false;
      },
      leave(){

      },
      /**
       * 监听tempArea根据鼠标移动变化面积
       * @param idx1
       * @param idx2
       */
      enter(idx1,idx2){

        console.log(idx1,idx2)

        //没有进入编辑模式则不算
        if(!this.isTempDrag)return;

        this.tempArea.row_idx1 = idx1;
        this.tempArea.col_idx1 = idx2;


        //分别获取最小的x和y的取值范围
        let y = Math.min(this.tempArea.row_idx1, this.tempArea.row_idx);
        let y1 = Math.max(this.tempArea.row_idx1, this.tempArea.row_idx);//需要多数一格

        let x = Math.min(this.tempArea.col_idx1, this.tempArea.col_idx);
        let x1 = Math.max(this.tempArea.col_idx1, this.tempArea.col_idx);//需要多数一格

        //大的数值加1
        y1++;
        x1++;


        //碰撞检测来一下
        if(!this.CTX.is_conflict({x,y,x1,y1})){
          this.tempAreaObj = {x,y,x1,y1}
        }





      },
      domainFunc(url) {
        console.log(url);
        return domain(url);
      },
      uploadImgCB(res) {
        console.log(res.data.path);
        if (!res.data.path) return;
        if (!this.currentArea) return;

        this.$set(this.currentArea, 'bgimg', domain(res.data.path));//不这样数据装死不动


      },
      activeArea(idx, area) {
        this.areaActiveIndxx = idx;
        this.currentArea = area;
      },
      dragSelect() {

      },
      delArea(area) {
        this.CTX.del_selects(area);
        this.clearIdx();
      },
      getTip(area){
        let width =  (area.x1 - area.x) * this.colWH;
        let height =  (area.y1 - area.y) * this.colWH;

        return `${width}x${height}像素或同等比例`;

      },
      getAreaStyle(area) {
        console.log(area)
        let styleObj = {
          left: area.x * this.colWH + 'px',
          top: area.y * this.colWH + 'px',
          width: (area.x1 - area.x) * this.colWH + 'px',
          height: (area.y1 - area.y) * this.colWH + 'px',
        };
        console.log(styleObj)
        // if(area.bgimg){
        //   console.log(333)
        //   styleObj.backgroundImage = 'url('+domain(area.bgimg)+')';
        // }
        return styleObj;
      },
      colClick(idx1, idx2) {
        console.log(idx1, idx2);
        if (!this.isDrag) {
          console.log('赋值给第1个');
          this.row_idx = idx1;
          this.col_idx = idx2;

          //考虑下tempArea
          this.tempArea.row_idx = idx1;
          this.tempArea.col_idx = idx2;
          this.isTempDrag = true;

          this.isDrag = true;
          return;
        }


        if (this.isDrag) {

          this.clearTempArea()

          //同一个区块点两次，也取消掉
          //老大牛逼，说一个点也可以创建 2019.9.30
          // if (this.row_idx === idx1 && this.col_idx === idx2) {
          //   this.isDrag = false;
          //   return;
          // }

          console.log('赋值给第二个');
          this.row_idx1 = idx1;
          this.col_idx1 = idx2;
          this.isDrag = false;

          //分别获取最小的x和y的取值范围
          let y = Math.min(this.row_idx1, this.row_idx);
          let y1 = Math.max(this.row_idx1, this.row_idx);//需要多数一格

          let x = Math.min(this.col_idx1, this.col_idx);
          let x1 = Math.max(this.col_idx1, this.col_idx);//需要多数一格

          //大的数值加1
          y1++;
          x1++;

          //创建矩形试试
          //let tempArea = getAreaPoint(x,y,x1,y1,this.colWH);

          //需要乘以单元格的长度，获得实际像素
          let createRT = this.CTX.create_area(x, y, x1, y1);

          createRT && this.dragSelect(x, y, x1, y1);


          this.currentArea = this.CTX.selects[this.CTX.selects.length - 1];//新增的话，就把最新的给他


        }


      },
      changeActive(idx1, idx2) {

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
      clearIdx() {
        this.row_idx = null;
        this.col_idx = null;
        this.row_idx1 = null;
        this.col_idx1 = null;
      },
    },
    created() {

      this.CTX = new MagicCube();
      window.CTX = this.CTX;
    }
  };

</script>
<style lang="less" scoped>
  @import "~@/assets/css/fun.less";


  .active{
    position: absolute;
    z-index: 2;
    box-sizing: border-box;
    border: 1px #409EFF solid;

    /*background: #e8f7fd;*/
    box-sizing: border-box;
    /*z-index: 2;*/
    &:hover{
      z-index: 333;
      .delicon{
        visibility: visible;
      }
    }


    .tip{
      position: absolute;
      width: 50%;
      left: 25%;
      text-align: center;
      line-height: 1.2;
      top: 50%;
      font-size: 12px;
      color: #155bd4;
      transform: translateY(-50%);
    }
    .mask{
      .cover-full-bg(cover,0,white);
      position: absolute;
      left:1px;
      bottom:1px;
      right: 1px;
      top:1px;
      background-color: #e8f7fd;
    }

    &.act{
      border: 1px #409EFF solid;
      .delicon{
        visibility: visible;
      }
    }


    .delicon{
      visibility: hidden;
      position: absolute;
      z-index: 33;
      font-size: 20px;
     width: 20px;
      height: 20px;
      right: -10px;
      top: -10px;
      z-index: 339;
      cursor: pointer;
      background: white;
      border-radius: 50%;
      overflow: hidden;
      color: #ff4444;
      /*&:hover{*/
      /*  color: #409eff;*/
      /*}*/
    }
  }




  .hover {
    position: absolute;
    z-index: 1;
    .mask {

      position: absolute;
      left: 0px;
      bottom: 0px;
      right: 0px;
      top: 0px;
      background-color: #e8f7fd;
    }

    /*&.act {*/
    /*  border: 1px rgba(63, 142, 243, 1) solid;*/

    /*  .delicon {*/
    /*    visibility: visible;*/
    /*  }*/
    /*}*/

    /*box-sizing: border-box;*/
    /*border: 1px rgba(40, 95, 165, 0.1) solid;*/

    /*background: rgba(63, 142, 243, 0.1);*/
    /*box-sizing: border-box;*/
    /*z-index: 2;*/

    /*&:hover {*/
    /*  .delicon {*/
    /*    visibility: visible;*/
    /*  }*/
    /*}*/

    /*.delicon {*/
    /*  visibility: hidden;*/
    /*  position: absolute;*/
    /*  font-size: 20px;*/
    /*  right: -10px;*/
    /*  top: -10px;*/
    /*  z-index: 339;*/
    /*  cursor: pointer;*/
    /*  color: #66b1ff;*/

    /*  &:hover {*/
    /*    color: #409eff;*/
    /*  }*/
    /*}*/
  }

  .wrap{
    background: #f2f2f2;
  }
  .box {
    margin: 20px;
    position: relative;
    background: white;

    .border();
    /*box-sizing: border-box;*/

    .row {
      /*box-sizing: border-box;*/
        position: relative;
        z-index: 2;
      .column {
        display: inline-block;
        box-sizing: border-box;
        background: none;

        &:last-child {
          .border-right(0px);
        }

        .border-right();
        .border-bottom();
      }

      &:last-child {
        .column {
          .border-bottom(0px);
        }
      }
    }
  }
</style>
