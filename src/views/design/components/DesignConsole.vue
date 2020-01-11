<template>
  <div class="wrap" >
<!--    <div class="mobile" @drop="dropEv" @dragover.prevent>-->
<!--      <single-dom-->
<!--        v-for="(dom,idx) in nodeList"-->
<!--        :key="idx"-->
<!--        :node="dom"-->
<!--        :draggable="currentDom.vid===dom.vid"-->
<!--        :index="idx"-->
<!--        @click.stop="setCurrent(idx)"-->

<!--      >-->
<!--      </single-dom>-->
<!--    </div>-->
    <div class="mobile" @drop="dropEv" @dragover.prevent>
<!--      width: 404px;-->
<!--      height: 718px;-->
      <canvas id="canvas" width="404px" height="718px"  ></canvas>
    </div>

    <div class="handle">
      <el-button  type="primary" size="small">保存</el-button>
      <el-button  size="small">重置</el-button>
      <!--      <div class="preBox" >-->
      <!--        <el-button @click="saveData(0,1)" size="small">预览</el-button>-->
      <!--        <div class="tooltip" v-show="centerDialogVisible" @click="centerDialogVisible=false">-->
      <!--          <div class="qrcode"><qrcode-vue :value="preUrl" size="200" level="H"></qrcode-vue></div>-->
      <!--          <div class="font12" style="line-height: 20px;height: 20px">扫一扫预览</div>-->
      <!--        </div>-->
      <!--      </div>-->
    </div>
  </div>
</template>

<script lang="ts">
  import {
    Vue,
    Component
  } from 'vue-property-decorator'

  import SingleDom from './SingleDom'
  import {Design} from "./Design";
  import {fabric} from 'fabric';


  const LabeledRect = fabric.util.createClass(fabric.Rect, {
    type: 'labeledRect',
    initialize: function(options) {
      options || (options = { });
      this.callSuper('initialize', options);
      this.set('label', options.label || '');
      this.set('labelFont', options.labelFont || '');
      this.set('labelFill', options.labelFill || '');
    },
    toObject: function() {
      return fabric.util.object.extend(this.callSuper('toObject'), {
        label: this.get('label'),
        labelFont: this.get('labelFont'),
        labelFill: this.get('labelFill')
      });
    },
    _render: function(ctx) {
      this.callSuper('_render', ctx);
      // ctx.font = '20px Helvetica';
      // ctx.fillStyle = '#333';
      console.log('this', this);
      ctx.font = this.labelFont;
      ctx.fillStyle = this.labelFill;
      // ctx.fillText(this.label, -this.width/2, -this.height/2 + 20);
      ctx.fillText(this.label, 0, 0+10);
    }
  });


  @Component({
    components:{
      SingleDom
    }
  })



  export default class DesignConsole extends Vue{
    //nodeList
    canvasInstance = null

    currentDom = {

    }

    nodeList = []

    //基础配置
    conf = {}

    setCommonAttr(obj){
      obj.set({
        transparentCorners: false,
        cornerColor: 'blue',
        cornerStrokeColor: 'red',
        borderColor: 'red',
        cornerSize: 12,
        padding: 10,
        cornerStyle: 'rect',
        borderDashArray: [3, 3]
      });
    }

    createdText(text){
      let textInstance = new fabric.Text(text, {//绘制文本
        fontSize: 16,
        // originX: 'center',
        // originY: 'center'
      })
      this.setCommonAttr(textInstance)
      this.canvasInstance.add(textInstance);

    }

    dropEv(e: any) {
      let url = e.dataTransfer.getData('file-url');
      if (url === '') return; // 在页面内拖动时，无需添加组件
      let imgNode = Design.createNode({tag:'img',value:url})
      this.nodeList.push(imgNode)
      //console.log(url)

      fabric.Image.fromURL(url,(oImg:any)=>{
        //console.log(url,oImg)
        //将图片缩小并翻转，然后再将其添加到画布上
        //oImg.scale(0.5).set('flipX',true);

        this.setCommonAttr(oImg)
        // oImg.set({
        //   transparentCorners: false,
        //   cornerColor: 'blue',
        //   cornerStrokeColor: 'red',
        //   borderColor: 'red',
        //   cornerSize: 12,
        //   padding: 10,
        //   cornerStyle: 'rect',
        //   borderDashArray: [3, 3]
        // });
        this.canvasInstance.add(oImg);
      })

    }

    drag(e){
      console.log(e)
    }

    //选中
    setCurrent(idx){
      this.currentDom = this.nodeList[idx]
    }

    created(){
      //Design.init({conf:this.conf,nodes:this.nodeList})
    }

    mounted(){

      this.$nextTick().then(()=>{
        var canvas = new fabric.Canvas('canvas',{
          backgroundColor : "#fff",
          // width: '600',
          // height: '600'
        });
        this.canvasInstance = canvas;
        // var rect = new fabric.Rect({
        //   top : 0,
        //   left : 0,
        //   width : 40 ,
        //   height : 60,
        //   fill : 'red'
        // });
        //
        // canvas.add(rect);
      })

      //Design.initSort()
    }


  }
</script>

<style lang="less" scoped>
.wrap{
  position: absolute;
  width: 100%;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
}

.mobile{
  /*position: absolute;*/
  /*left: 50%;*/
  /*top: 50%;*/
  /*transform: translate(-50%,-50%);*/
  /*position: relative;*/
  /*background: #fff;*/
  margin: 0 auto;
  width: 404px;
  height: 718px;
  overflow: hidden;
  box-sizing: border-box;
  box-shadow: 1px 1px 4px 4px rgba(0, 0, 0, 0.1);

  &:hover{
    /*border:1px dashed #999;*/
  }
}
.handle{
  margin:10px auto;
  width:200;
  height:50px;
  display:flex;
  align-items:center;
  /*background:white;*/
  justify-content:center;

  .preBox{
    margin-left: 10px;
    position: relative;
    .tooltip{
      position: absolute;
      bottom: 50px;
      left: -80px;
      transform: translate(0%,0%);
      background-color: #d5d5d5;
      color: #444;
      text-align: center;
      font-size: 12px;
      border-radius: 2px;
      .qrcode{
        padding:  6px 6px 0 6px ;
      }
      &::after {
        content: " ";
        position: absolute;
        top: 100%; /* 提示工具底部 */
        left: 50%;
        margin-left: -5px;
        border-width: 5px;
        border-style: solid;
        border-color: #d1d1d1 transparent transparent transparent;
      }
    }
  }
}
</style>
