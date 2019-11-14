<template>
  <div class="wrap">
    <div class="box" :style="{width:W+'px',height:H+'px'}" @mouseleave="leaveBox"
         @mouseenter="enterBox">
      <div v-for="(row,idx1) in CTX.row" class="row" :style="{height:colH+'px'}">
        <div
          @click="colClick(idx1,idx2)"
          v-on:mouseenter="changeActive(idx1,idx2)"
          @mouseenter="enter(idx1,idx2)" @mouseleave="leave()"
          v-for="(row,idx2) in CTX.col"
          class="column text-center"
          :style="{width:colH+'px',height:colH+'px',lineHeight:colH+'px'}">
          <!--          {{idx1+'—'+idx2}}-->
        </div>
      </div>



      <!--所有热区用绝对定位实现-->
      <div class="active" :data-idx="area.IDX" @click.stop="activeArea(aidx,area)"   :class="areaActiveIndex===aidx?'act':''"
           :style="[getAreaStyle(area)]" v-for="(area,aidx) in CTX.selects">
        <div  class="mask" :style="{backgroundImage:'url('+area.bgimg||''+')'}"></div>
        <span class="tip" v-show="!area.bgimg">{{getTip(area)}}</span>
        <!--        <img src="@/assets/img/icon-del.png" class="delicon" />-->
        <i v-if="type==='diy'" class="el-icon-error delicon" @click.stop="delArea(area)"/>
        <!--        <svg class="fun-icon icon delicon" @click="delArea(area)" aria-hidden="true">-->
        <!--          <use xlink:href="#icon-del"></use>-->
        <!--        </svg>-->
      </div>

      <div v-show="mouseInBox" class="hover" :style="[getAreaStyle(tempAreaObj)]">
        <div class="mask"></div>
      </div>
    </div>

    <div style="height: 20px"></div>

    <div  v-if="areaActiveIndex>=0 && CTX.selects.length>0 ">
      <upload-img-components :small="true" :img-url="currentArea.bgimg" class="myUploadImg" :onSuccess='uploadImgCB'
                             type='avatar'
      ></upload-img-components>
    </div>

    <div  v-if="areaActiveIndex>=0 && CTX.selects.length>0  ">
      <el-tooltip class="item rightBtn" effect="dark" :content="currentArea.tooltip" placement="right">
        <el-button @click="bindLink"  type="primary"  size="small">绑定链接</el-button>
      </el-tooltip>
      <span class="graytext font12 padding10-c">{{currentArea.tooltip|cutstr(14,'..')}}</span>
    </div>

  </div>

</template>

<script>

import MagicCube from '../../../assets/js/diy/tool/MagicCube';

import {domain} from '@/common/utils';
import {objTranslate} from '../../../common/utils';
import UploadImgComponents from '@/components/diy/tool/UploadImgComponents';

import BindLinkComponents from '@/components/BindLinkComponents';
import _ from 'underscore'

export default {
  name:'MagicCubeComponent',
  props:{
    selecteds:{
      type:Array,
      default:[],//function(){return []}
    },
    row:{
      type:Number,
      default:5
    },
    type:{

    },
    col:{
      type:Number,
      default:5
    },

    width:{
      type:Number,
      default:375
    }
  },
  data(){
    return {
      CTX: null,
      mouseInBox: false,
      currentArea: {},
      tempAreaObj: {
        x: null,
        y: null,
        x1: null,
        y1: null
      },
      tempArea: {
        row_idx: null,//行序列1
        col_idx: null,//竖直序列1
        row_idx1: null,//行序列2
        col_idx1: null//竖直序列2
      },
      isTempDrag: false,
      areaActiveIndex: null,
      isDrag: false,//标记是否点击了一次
      row_idx: null,//行序列1
      col_idx: null,//竖直序列1
      row_idx1: null,//行序列2
      col_idx1: null//竖直序列2
    }
  },
  components:{
    UploadImgComponents,BindLinkComponents
  },
  computed:{
    W(){
      return this.CTX.width
    },
    H(){
      return this.CTX.height
    },
    colWH(){
      return this.CTX.width/this.CTX.row
    },
    colH(){
      return this.CTX.height/this.CTX.row
    },
    rowW(){
      return this.CTX.width/this.CTX.col
    }
  },
  watch:{
    row:{
      immediate:true,
      handler(val){

        this.rest()
        this.INIT()
      }
    },
    type:{

      handler(val){
        this.rest()
        this.INIT()
      }
    },
    col:{
      immediate:true,
      handler(val){
        this.rest()
        this.INIT()
      }
    },
    selecteds:{
      immediate:true,
      deep:true,
      handler(val){
        // console.log('333333333333333selecteds发生修改',val);
      }
    },
    //传上去
    'CTX.selects':{
      deep:true,
      handler(val){
        this.$emit('selectChange',objTranslate(val))
      }
    }
  },
  methods:{
    bindLink(){
      // console.log(this.areaActiveIndex);
      this.$emit('openBindLink',this.areaActiveIndex)
    },
    rest(){

      this.CTX=null;
      this.currentArea={};
      this.areaActiveIndex=null;
      this.showConfig=false;
      this.isDrag=false;//标记是否点击了一次
      this.row_idx=null;//行序列1
      this.col_idx=null;//竖直序列1
      this.row_idx1=null;//行序列2
      this.col_idx1=null;//竖直序列2


    },
    enterBox() {
      this.mouseInBox = true;
    },
    leaveBox() {
      // this.clearTempArea()
      this.mouseInBox = false;

    },
    /**
     * 清理
     */
    clearTempArea() {
      this.tempArea = {
        row_idx: null,//行序列1
        col_idx: null,//竖直序列1
        row_idx1: null,//行序列2
        col_idx1: null//竖直序列2
      };

      this.tempAreaObj = {
        x: null,
        y: null,
        x1: null,
        y1: null
      };

      this.isTempDrag = false;
    },
    leave() {

    },
    /**
     * 监听tempArea根据鼠标移动变化面积
     * @param idx1
     * @param idx2
     */
    enter(idx1, idx2) {

      // console.log(idx1, idx2);

      //没有进入编辑模式则不算
      if (!this.isTempDrag) return;

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
      if (!this.CTX.is_conflict({
        x,
        y,
        x1,
        y1
      })) {
        this.tempAreaObj = {
          x,
          y,
          x1,
          y1
        };
      }


    },
    domainFunc(url) {
      // console.log(url);
      return domain(url);
    },
    uploadImgCB(res) {
      // console.log(res.data.path);
      if (!res.data.path) return;
      if (_.isEmpty(this.currentArea)) return;

      this.$set(this.currentArea, 'bgimg', domain(res.data.path));//不这样数据装死不动


    },
    activeArea(idx, area) {

      // console.log('4444444444444')
      this.areaActiveIndex = idx;
      this.currentArea = area;
    },
    dragSelect() {

    },
    delArea(area) {
      // console.log('3333333')
      this.CTX.del_selects(area);
      this.clearIdx();
    },
    getTip(area) {
      let width = (area.x1 - area.x) * this.rowW*2;
      let height = (area.y1 - area.y) * this.colH*2;

      width = parseInt(width)
      height = parseInt(height)

      return `${width}x${height}像素或同等比例`;

    },
    getAreaStyle(area) {
      // console.log(area);
      let styleObj = {
        left: area.x * this.rowW + 'px',
        top: area.y * this.colH + 'px',
        width: (area.x1 - area.x) * this.rowW + 'px',
        height: (area.y1 - area.y) * this.colH + 'px',
      };
      // console.log(styleObj);
      // if(area.bgimg){
      //   console.log(333)
      //   styleObj.backgroundImage = 'url('+domain(area.bgimg)+')';
      // }
      return styleObj;
    },
    colClick(idx1, idx2) {
      // console.log(idx1, idx2);
      if (!this.isDrag) {
        // console.log('赋值给第1个');
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

        this.clearTempArea();

        //同一个区块点两次，也取消掉
        //老大牛逼，说一个点也可以创建 2019.9.30
        // if (this.row_idx === idx1 && this.col_idx === idx2) {
        //   this.isDrag = false;
        //   return;
        // }

        // console.log('赋值给第二个');
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

      // console.log(322)
      this.currentArea = {};

      this.areaActiveIndex = -1;
    },
    INIT(){
      this.CTX = new MagicCube(this.row,this.col,this.width,this.width*this.row/this.col);//还有label。。真牛
      this.CTX.selects = this.CTX.selects.concat(this.selecteds)
      //window.CTX = this.CTX;
    }
  },
  created() {

    this.INIT()

  }
}
</script>

<style lang="less" scoped>
  @import "~@/assets/css/fun.less";

  .active {
    position: absolute;
    z-index: 2;
    box-sizing: border-box;
    border: 1px rgba(64,158,255,.2) solid;

    /*background: #e8f7fd;*/
    box-sizing: border-box;
    /*z-index: 2;*/

    &:hover {
      z-index: 333;
      border: 1px rgba(64,158,255,.4) solid;

      .delicon {
        visibility: visible;
      }
    }


    .tip {
      position: absolute;
      overflow: hidden;
      width: 70%;
      left: 15%;
      padding: 4px;
      text-align: center;
      line-height: 1.2;
      top: 50%;
      font-size: 12px;
      color: #155bd4;
      transform: translateY(-50%);
    }

    .mask {
      .cover-full-bg(cover, 0, white);
      position: absolute;
      left: 0px;
      bottom: 0px;
      right: 0px;
      top: 0px;
      background-color: #e8f7fd;
    }

    &.act {
      border: 1px #409EFF solid;

      .delicon {
        visibility: visible;
      }
    }


    .delicon {
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

  .wrap {
    /*background: #f2f2f2;*/
  }

  .box {
    /*margin: 20px;*/
    position: relative;
    /*background: white;*/
    cursor: pointer;

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
