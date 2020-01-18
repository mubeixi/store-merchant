<template>
  <div
    class="wrap"
    @contextmenu.prevent="contextmenuFn($event)"
  >
    <div class="attr-bar">
      <div class="left">
        <el-dropdown class="item">
          <div class="el-dropdown-link">
            背景色<i class="el-icon-arrow-down el-icon--right"></i>
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <el-color-picker
                class="inputcolor fun-color-pick"
                @change="colorEvByBg"
              />
            </el-dropdown-item>

          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div class="right">

<!--        <el-dropdown class="item" @command="setFontFn">-->
<!--          <div class="el-dropdown-link">切换字体<i class="el-icon-arrow-down el-icon&#45;&#45;right"></i></div>-->
<!--          <el-dropdown-menu slot="dropdown">-->
<!--            <el-dropdown-item :command="font.fontFamily" v-for="(font,idx) in fontList">{{font.text}}</el-dropdown-item>-->

<!--          </el-dropdown-menu>-->
<!--        </el-dropdown>-->
        <el-dropdown class="item" @command="setFontSizeFn">
          <div class="el-dropdown-link">文字大小<i class="el-icon-arrow-down el-icon--right"></i></div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item :command="size" v-for="(size,idx) in fontSize">{{size}}</el-dropdown-item>
            <div class="padding10-c flex">
              <el-input style="width: 60px;" size="mini" type="text" v-model="fontSizeVal" />
              <div class="padding4-c"></div>
              <el-button size="mini" type="primary" @click="setFontSizeVal">确认</el-button>
            </div>
          </el-dropdown-menu>
        </el-dropdown>
        <el-dropdown class="item" @command="fabricForwardFn">
          <div class="el-dropdown-link">
            图层<i class="el-icon-arrow-down el-icon--right"></i>
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="forWard">上移一层</el-dropdown-item>
            <el-dropdown-item command="backWard">下移一层</el-dropdown-item>
            <el-dropdown-item command="toFront">移至顶端</el-dropdown-item>
            <el-dropdown-item command="toBack">移至底端</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-dropdown class="item">
          <div class="el-dropdown-link">
            颜色<i class="el-icon-arrow-down el-icon--right"></i>
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <el-color-picker
                class="inputcolor fun-color-pick"
                @change="colorEv"
              />
            </el-dropdown-item>

          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>

<!--    @keyup.delete="delCanvasElFn"-->
    <div
      class="mobile"
      id="mobile"
      @drop="dropEv"
      @dragover.prevent
      v-loading="loadingImageInstance"
      element-loading-text="加载资源"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.5)"
    >

      <canvas id="canvas" width="404px" height="587px"  ></canvas>

      <div class="removeModal" ref="removeModal" v-show="removePosition.show">
        <h4>您确定要删除这个组件吗？</h4>
        <p>
          <input type="button" value="确定" class="ok" @click="removeElement"/>
          <input type="button" value="取消" class="on" @click="removePosition.show = false"/>
        </p>
      </div>
      <ul class="contextmenuRight" ref="rightMenu" @mousedown.stop="hideRightMenu">
        <li class="menuList" type="showRemovePrompt">删除</li>
      </ul>


    </div>

    <div class="handle">
      <el-button @click="saveData"  type="primary" size="small">保存</el-button>
      <el-button @click="clearCanvas"  size="small">重置</el-button>
      <el-button v-if="is_dev" @click="preData"  size="small">查看数据</el-button>
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

  // import SingleDom from './SingleDom'
  import {Design} from "./Design";
  import {fabric} from 'fabric';
  import FontFaceObserver from 'fontfaceobserver'

  import {
    formatTime, domain, findArrayIdx
  } from "../../../common/utils";
  import {
    addPoster,
    getPosterList,
    getPosterDetail,
    commonReq,
    convertImageByBase64,
    uploadImgByBase64
  } from "../../../common/fetch";
  import {Loading} from "element-ui";
  import {isDev} from "../../../common/env";

  window.canvasInstance = {}
  function colorRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

    let r= parseInt(result[1], 16),
      g =  parseInt(result[2], 16),
      b = parseInt(result[3], 16);
    return result ? `rgb(${r},${g},${b})`: null;

  }
  // function colorRgb(str){
  //   var sColor = str.toLowerCase();
  //   //十六进制颜色值的正则表达式
  //   var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
  //   // 如果是16进制颜色
  //   if (sColor && reg.test(sColor)) {
  //     if (sColor.length === 4) {
  //       var sColorNew = "#";
  //       for (var i=1; i<4; i+=1) {
  //         sColorNew += sColor.slice(i, i+1).concat(sColor.slice(i, i+1));
  //       }
  //       sColor = sColorNew;
  //     }
  //     //处理六位的颜色值
  //     var sColorChange = [];
  //     for (var i=1; i<7; i+=2) {
  //       sColorChange.push(parseInt("0x"+sColor.slice(i, i+2)));
  //     }
  //     return "[" + sColorChange.join(",") + ",0.6]";
  //   }
  //   return sColor;
  // }

  function createImgElement(url) {
    return new Promise((resolve, reject) => {

      var img = new Image();
      img.src = url;//微信头像地址
      img.setAttribute('crossOrigin', 'anonymous');    // 重点
      img.onload=function(res){
        console.log(res,img)
        resolve(img)
      }
      // let imgEl = document.createElement('img')
      // imgEl.src = url
      // imgEl.className = 'fun-load-img';
      // imgEl.onload = (res)=>{
      //   console.log(res,imgEl)
      //   resolve(imgEl)
      // }
      // document.body.appendChild(imgEl)
    })
  }

  const fabricForward = function (_this, style) {

    const canvas:any = _this.canvasInstance
    console.log(canvas.getActiveObject())
    if (style == 'forWard') {
      canvas.bringForward(canvas.getActiveObject());

    }
    if (style == 'backWard') {
      canvas.sendBackwards(canvas.getActiveObject());

    }
    if (style == 'toFront') {
      canvas.bringToFront(canvas.getActiveObject());

    }
    if (style == 'toBack') {
      canvas.sendToBack(canvas.getActiveObject());

    }
    canvas.renderAll()
  }

  import {
    headimgBase64,
    qrcodeBase64
  } from "./img";
  import {arrayFindIndex} from "element-ui/src/utils/util";
  import {fun} from "../../../common";

  // import {
  //   fontList
  // } from "./fabric_action";

  @Component({
    components:{
      // SingleDom
    }
  })
  export default class DesignConsole extends Vue{

    // fontList = fontList
    fontSize = [12,16,20,24,26,30]
    is_dev = isDev

    imgBase = headimgBase64
    //nodeList
    canvasInstance = null

    currentDom = {

    }

    nodeList = []

    //基础配置
    conf = {}

    clearCanvas(){

      this.canvasInstance.clear();
    }

    setFontFn(font){

      const canvas = this.canvasInstance
      //canvas.getActiveObject().set("fontFamily","方正小篆体");
      var myfont = new FontFaceObserver(font);
      myfont.load().then(()=>{
          // when font is loaded, use it.

          let selectEl = canvas.getActiveObject()
          selectEl && selectEl.set('fontFamily',font);
          canvas.renderAll();

        }).catch(function(e) {
        console.log(e);
      });
    }

    fontSizeVal = ''
    setFontSizeVal(){
      this.setFontSizeFn(this.fontSizeVal)
      this.fontSizeVal = ''
    }

    setFontSizeFn(size){
      const canvas = this.canvasInstance
      let selectEl = canvas.getActiveObject()
      selectEl && selectEl.set('fontSize',size);
      canvas.renderAll();
    }

    colorEvByBg(val){


      val = colorRgb(val)
      console.log(`背景色${val}`)
      this.canvasInstance.setBackgroundColor(val,this.canvasInstance.renderAll.bind(this.canvasInstance))
    }

    setStyle(object, styleName, value) {
      if (object.setSelectionStyles && object.isEditing) {
        var style = { };
        style[styleName] = value;
        object.setSelectionStyles(style);
      }
      else {
        object[styleName] = value;
      }
    }

    colorEv(val) {
      val = colorRgb(val)
      const canvas = this.canvasInstance
      let selectEl = canvas.getActiveObject()
      console.log(selectEl)
      selectEl && selectEl.set('fill',val);//this.setStyle(selectEl,'fill',val)
      canvas.renderAll();
      //canvas.bringForward(canvas.getActiveObject());
      console.log('颜色改变了',val);

    }

    setCommonAttr(obj,is_area=false){
      obj.set({
        transparentCorners: false,
        cornerColor: '#999',
        cornerStrokeColor: 'white',
        borderColor: '#e7e7e7',
        cornerSize: 12,
        padding: 0,
        cornerStyle: 'circle',
        borderDashArray: [3, 3],
        // strokeDashArray:[5,5]
      });

      //带上标签，方便后面导出object_list的时候，用于替换
      obj.toObject = (function (toObject) {
        return function () {
          return fabric.util.object.extend(toObject.call(this), {
            fun_is_area:is_area,
            transparentCorners: false,
            cornerColor: '#999',
            cornerStrokeColor: 'white',
            borderColor: '#e7e7e7',
            cornerSize: 12,
            padding: 6,
            cornerStyle: 'circle',
            borderDashArray: [3, 3]
          });
        };
      })(obj.toObject);

      // obj.on('selected',(res)=>{
      //
      // });

    }



    headimg = false
    nickname = false
    qrcode = false
    time = false



    fabricForwardFn(type){
      console.log(type)
      fabricForward(this,type)
    }
    //排序
    // canvas.sendBackwards(myObject)
    // canvas.sendToBack(myObject) //移动到底层
    // canvas.bringForward(myObject)
    // canvas.bringToFront(myObject)

    saveBgImg(base64Data){

      return new Promise(((resolve, reject) => {
        let data = {image:base64Data};

        uploadImgByBase64(data).then(res => {
          resolve(res.data.path)
        })

      }))


    }

    preData(){
      let canvas = this.canvasInstance
      canvas.discardActiveObject().renderAll();

      let canvasData = canvas.toDatalessJSON()
      console.log('查看数据',canvasData)
    }

    async saveData(){

      let canvas = this.canvasInstance
      canvas.discardActiveObject().renderAll();
      console.log(canvas.getObjects())
      let canvasData = canvas.toDatalessJSON()
      console.log('保存数据',canvasData)
      //return;
      const loadingInstance = this.$loading({
        text:'保存模板'
      })

      try{

        // //获取base64图片
        // let base64Url = await this.canvasToImage()
        // //上传base64获取背景图
        // let bgImgPath = await this.saveBgImg(base64Url)
        let bgImgPath = ' ';

        const wrap = JSON.stringify({
            width:404,
            height:587
          })

        let postData = {
          wrap,
          img:bgImgPath,
          name:"分享海报模板_" + new Date().getTime(),
          data:JSON.stringify(canvasData)
        }

        //保存数据
        let saveRt = await addPoster(postData)
        console.log(saveRt)
        loadingInstance.close()


        //清空画布
        this.clearCanvas()

        //重新获取列表
        this.$parent.$refs.tmpl.getTmplList()
        this.restRight()

      }catch (e) {
        loadingInstance.close()
        fun.error({msg:'保存失败：'+e.message})
      }


    }


    //根据选中模板加载
    initByTmpl(json){

      const canvas = this.canvasInstance
      canvas.clear()

      let parseObject = JSON.parse(json)
      console.log(parseObject)

      canvas.loadFromJSON(json,()=>{

        //this.refreshWrap()
        let objects = canvas.getObjects()
        console.log(objects)
        let rightCheck = []
        for(let obj of objects){
          console.log(obj.fun_is_area)
          if(obj.hasOwnProperty('fun_is_area')){
            rightCheck.push(obj.fun_is_area)
          }
          this.setCommonAttr(obj,obj.hasOwnProperty('fun_is_area')?obj.fun_is_area:false)
        }

        //this.refreshWrap()

        this.restRight(rightCheck)

      });


    }


    refreshWrap(){
      this.canvasInstance.renderAll();
    }

    restRight(rightCheck){
      this.$parent.$refs.resource.refresh(rightCheck)
    }

    transformFn(direction){
      var el = this.canvasInstance.getActiveObject()
      if(!el)return

      let transform = {}
      switch(direction){
        case 'up':
          transform = {top:--el.top}
          break;
        case 'left':
          transform = {lfet:--el.left}
          break;
        case 'right':
          transform = {left:++el.left}
          break
        case 'down':
          transform = {top:++el.top}
          break;
      }

      el.set(transform)
      this.refreshWrap()
    }


    removePosition = {
      show: false
    }

    contextmenuFn(event){
      console.log(event)
      // this.showContextMenu(event, {});
      let canvas = this.canvasInstance
      //var pointer = canvas.getPointer(event);
      var objects = canvas.getObjects();
      for (var i = objects.length - 1; i >= 0; i--) {
        var object = objects[i];
        var objectData = object.toObject()
        //判断该对象是否在鼠标点击处
        //占位图像没用
        if (objectData.fun_is_area === false && canvas.containsPoint(event, object)) {
          //选中该对象
          canvas.setActiveObject(object).renderAll();
          //显示菜单
          this.showContextMenu(event, object);
          break;
        }
      }

      return false;
    }

    //右键菜单项点击
    showContextMenu(e, object) {
      //定义右键菜单项

      //右键菜单显示位置
      this.$refs.rightMenu.style.display = 'block';
      this.$refs.rightMenu.style.left = `${e.clientX}px`;
      this.$refs.rightMenu.style.top = `${e.clientY}px`;

      this.removePosition.x = e.clientX;
      this.removePosition.y = e.clientY;

    }


    showRemovePrompt() {
      this.removePosition.show = true
      this.$refs.removeModal.style.left = this.removePosition.x + 'px'
      this.$refs.removeModal.style.top = this.removePosition.y + 'px'
    }

    hideRightMenu(e) {
      const type = e.target.getAttribute('type');
      this.$refs.rightMenu.style.display = 'none';
      this[type] && this[type]();
    }

    //右键菜单项点击
    removeElement(key, options) {

      const canvas = this.canvasInstance
      var obj = canvas.getActiveObject();

      //不是占位
      if(obj){
        const objData  = obj.toObject()

        if(objData.fun_is_area===false){
          canvas.remove(obj);
          canvas.renderAll();
        }else{
          fun.error({msg:'占位组件请点击右侧清除'})
        }

      }else{
        fun.error({msg:'请选中需要删除的组件'})
      }

      this.removePosition.show = false
    }


    /**@augments
     * fucntion 转为图片并下载到本地
     */
    canvasToImage() {
      var MIME_TYPE = "image/png";
      //转换成base64
      let canvasEl:any = document.getElementById('canvas')
      var imgURL = canvasEl.toDataURL(MIME_TYPE); //创建一个a链接，模拟点击下载

      return imgURL
      // var dlLink = document.createElement("a");
      // var filename = "个人画板_" + new Date().getTime() + ".png";
      // dlLink.download = filename;
      // dlLink.href = imgURL;
      // dlLink.dataset.downloadurl = [
      //   MIME_TYPE,
      //   dlLink.download,
      //   dlLink.href
      // ].join(":");
      // document.body.appendChild(dlLink);
      // dlLink.click();
      // document.body.removeChild(dlLink);
    }

    delCanvasElFn(){
      this.del()
    }
    del() {
      var el = this.canvasInstance.getActiveObject();
      console.log(el)
      this.canvasInstance.remove(el);
    }


    /**
     * 创建区域
     * @param tagName
     */
    createArea(tagName){

      let areaInstance = null
      switch (tagName) {
        case 'headimg':
          areaInstance = fabric.Image.fromURL(headimgBase64,(oImg)=>{
            oImg.scale(0.6);
            oImg.set({
              left: 20,
              top: 20,
            });
            this.setCommonAttr(oImg,'headimg')
            this.canvasInstance.add(oImg);
            console.log(oImg)
          })

          break;
        case 'nickname':
          //不可以编辑
          areaInstance = new fabric.Text('用户昵称', {//绘制文本
            fontSize: 16,
            left: 20,
            top: 20,
            // originX: 'center',
            // originY: 'center'
          })

          this.setCommonAttr(areaInstance,'nickname')
          this.canvasInstance.add(areaInstance);
          break;
        case 'qrcode':
          areaInstance = fabric.Image.fromURL(qrcodeBase64,(oImg)=>{
            this.setCommonAttr(oImg,'qrcode')
            oImg.scale(0.6);
            oImg.set({
              left: 20,
              top: 20,
            });
            this.canvasInstance.add(oImg);
            console.log(oImg)
          })
          break;
        case 'time':
          areaInstance = new fabric.Text(formatTime(null,'ymd'), {//绘制文本
            fontSize: 16,
            left: 20,
            top: 20,
          })
          this.setCommonAttr(areaInstance,'time')
          this.canvasInstance.add(areaInstance);
          break;
      }

    }

    deletedArea(tagName){

      let areaInstance = null

      const canvas = this.canvasInstance


      var objects = canvas.getObjects();

      let rt = []
      for(let obj of objects){
        let objData = obj.toObject()
        if(objData.hasOwnProperty('fun_is_area') && objData.fun_is_area === tagName){

          canvas.remove(obj);
          canvas.renderAll();
          break;
        }
      }





      // let idx = arrayFindIndex(rt,{fun_is_area:tagName});

      // canvas.remove(el);

      switch (tagName) {
        case 'headimg':
          break;
        case 'nickname':
          break;
        case 'qrcode':
          break;
        case 'time':

          break;
      }

    }



    createText(text){
      //可以编辑
      let textInstance = new fabric.IText(text, {//绘制文本
        fontSize: 16,
        left: 20,
        top: 20,
        // originX: 'center',
        // originY: 'center'
      })
      this.setCommonAttr(textInstance)
      this.canvasInstance.add(textInstance);
      // textInstance.enterEditing();
      // textInstance.hiddenTextarea.focus();

    }


    loadingImageInstance = false
    dropEv(e) {

      let url = e.dataTransfer.getData('file-url');
      if (url === '') return; // 在页面内拖动时，无需添加组件
      //let imgNode = Design.createNode({tag:'img',value:url})
      //this.nodeList.push(imgNode)
      //console.log(url)


      //地址都用domain处理一下
      fabric.Image.fromURL(domain(url),(oImg)=>{
        this.setCommonAttr(oImg)
        oImg.scale(0.6);
        oImg.set({
          left: 20,
          top: 20,
        })
        this.canvasInstance.add(oImg);
      })

          // setTimeout(()=>{
          //   this.loadingImageInstance = false
          // },500)

      //this.loadingImageInstance = true

      //
      // fetch(`http://localhost:9100/blob?path=${url}`)
      //   .then(function(response) {
      //     return response.json();
      //   })
      // convertImageByBase64({img_url:url})
      //   .then((res:any)=>{

      //     let imgBolbUrl = res.data
      //     fabric.Image.fromURL(imgBolbUrl,(oImg)=>{
      //       this.setCommonAttr(oImg)
      //       oImg.scale(0.6);
      //       oImg.set({
      //         left: 20,
      //         top: 20,
      //       })
      //       this.canvasInstance.add(oImg);
      //     })

      //     setTimeout(()=>{
      //       this.loadingImageInstance = false
      //     },500)


      // }).catch(e=>{})

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

        document.getElementById('mobile').style.marginTop = (document.body.offsetHeight-587-44-70)/2+44+'px'
        var canvas = new fabric.Canvas('canvas',{
          backgroundColor : colorRgb("#FFFFFF"),
          // width: '600',
          // height: '600'
        });
        // canvas.rotationCursor = 'pointer'; //默认光标改成十字
        // canvas.hoverCursor = 'pointer'; //悬浮光标改成手型

        canvas.preserveObjectStacking = true;
        this.canvasInstance = canvas;
        window.canvasInstance = canvas;


        document.onkeydown = (e) => {
          let key = window.event.keyCode;
          switch (key) {
            case 38:
              this.transformFn('up')
              break;
            case 40:
              this.transformFn('down')
              break;
            case 37:
              this.transformFn('left')
              break;
            case 39:
              this.transformFn('right')
              break;

          }
        };

      })

      //Design.initSort()
    }


  }
</script>

<style lang="less" scoped>
  /*@font-face {*/
  /*  font-family:'宋体';*/
  /*  src:url('/static/fonts/simsun.tts'),url('/member/shop/setting/diy/static/fonts/simsun.tts');*/
  /*}*/
  /*@font-face {*/
  /*  font-family:'arial';*/
  /*  src:url('/static/fonts/arial.ttf'),url('/member/shop/setting/diy/static/fonts/arial.ttf');*/
  /*}*/
  /*@font-face {*/
  /*  font-family:'consola';*/
  /*  src:url('/static/fonts/consola.ttf'),url('/member/shop/setting/diy/static/fonts/consola.ttf');*/
  /*}*/
  /*@font-face {*/
  /*  font-family:'DENG';*/
  /*  src:url('/static/fonts/DENG.TTF'),url('/member/shop/setting/diy/static/fonts/DENG.TTF');*/
  /*}*/
  /*@font-face {*/
  /*  font-family:'DENGB';*/
  /*  src:url('/static/fonts/DENGB.TTF'),url('/member/shop/setting/diy/static/fonts/DENGB.TTF');*/
  /*}*/
  /*@font-face {*/
  /*  font-family:'DENGL';*/
  /*  src:url('/static/fonts/DENGL.TTF'),url('/member/shop/setting/diy/static/fonts/DENGL.TTF');*/
  /*}*/
  /*@font-face {*/
  /*  font-family:'msyh';*/
  /*  src:url('/static/fonts/msyh.ttf'),url('/member/shop/setting/diy/static/fonts/msyh.ttf');*/
  /*}*/
  /*@font-face {*/
  /*  font-family:'msyhbd';*/
  /*  src:url('/static/fonts/msyhbd.ttf'),url('/member/shop/setting/diy/static/fonts/msyhbd.ttf');*/
  /*}*/
  /*@font-face {*/
  /*  font-family:'simkai';*/
  /*  src:url('/static/fonts/simkai.ttf'),url('/member/shop/setting/diy/static/fonts/simkai.ttf');*/
  /*}*/
  /*@font-face {*/
  /*  font-family:'simsun';*/
  /*  src:url('/static/fonts/simsun.ttf'),url('/member/shop/setting/diy/static/fonts/simsun.ttf');*/
  /*}*/
  /*@font-face {*/
  /*  font-family:'SIMYOU';*/
  /*  src:url('/static/fonts/SIMYOU.TTF'),url('/member/shop/setting/diy/static/fonts/SIMYOU.TTF');*/
  /*}*/
  /*@font-face {*/
  /*  font-family:'STXIHEI';*/
  /*  src:url('/static/fonts/STXIHEI.ttf'),url('/member/shop/setting/diy/static/fonts/STXIHEI.ttf');*/
  /*}*/

.attr-bar{
  position: absolute;
  top: 0;
  display: flex;
  justify-content: space-between;
  height: 44px;
  background: white;
  width: 100%;

  .left{
    display: flex;
    line-height: 44px;
    padding-right: 20px;
    .el-dropdown-link {
      cursor: pointer;
      margin-left: 10px;
      padding: 0 15px;
      &:hover{
        color: #409EFF;
      }
    }
    .el-icon-arrow-down {
      font-size: 12px;
    }

  }

  .right{
    display: flex;
    justify-content: right;
    line-height: 44px;
    padding-right: 20px;
    .el-dropdown-link {
      cursor: pointer;

      margin-left: 10px;
      padding: 0 15px;
      &:hover{
        color: #409EFF;
      }
    }
    .el-icon-arrow-down {
      font-size: 12px;
    }

  }
}

.wrap{
  /*position: absolute;*/
  /*width: 100%;*/
  /*height: 100%;*/
  /*left: 0;*/
  /*top: 0%;*/
  //transform: translateY(-50%);
}

.mobile{
  /*position: absolute;*/
  /*left: 50%;*/
  /*top: 50%;*/
  /*transform: translate(-50%,-50%);*/
  /*position: relative;*/
  /*background: #fff;*/
  margin: 0 auto;
  margin-top: 10%;
  width: 404px;
  height: 587px;
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

.contextmenuRight {
  display: none;
  overflow: hidden; /*隐藏溢出的元素*/
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  position: fixed; /*自定义菜单相对与body元素进行定位*/
  background-color: white;
  z-index: 212121;
  // padding: 10px 0;
  border: 1px solid #e6e6e6;
  font-size: 14px;
}

.menuList {
  width: 130px;
  line-height: 36px;
  padding: 0 20px;
  cursor: default;

  &:hover {
    background-color: #e6e6e6;
  }
}

.removeModal {
  position: fixed;
  right: 30px;
  top: 250px;
  z-index: 21;
  background-color: white;
  padding: 10px;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  width: 200px;

  h4 {
    font-weight: normal;
    font-size: 14px;
  }

  p {
    overflow: hidden;
    margin-top: 20px;

    input {
      float: right;
      box-sizing: border-box;
      font-size: 12px;
      background-color: #f0f0f0;
      border: none;
      width: 50px;
      height: 26px;
      cursor: pointer;
    }

    .ok {
      background-color: #418ef6;
      color: white;
    }

    .on {
      margin-right: 10px;
    }
  }
}
</style>
