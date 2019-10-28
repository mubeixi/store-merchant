<template>
  <div class="wrap">
    <!--    <header class="boxShadow mainHeader" style="">-->
    <!--      <el-button type="primary" size="small">保存并继续</el-button>-->
    <!--    </header>-->
    <div class="flex main">
      <div class="plugins">
        <plugins-component></plugins-component>
      </div>
      <div class="preview" >
        <div class="preview-page">
          <div @click="setAct(0,'system','全局设置','针对页面的整体配置')" :class="{active:mode==='system'}" class="item preview-page-options"><i class="preview-page-options-icon"></i>全局设置</div>
          <div @click="setAct(1,'plugin','组件管理','可以便捷拖动、删除组件')" :class="{active:mode==='plugin'}" class="item preview-page-coms"><i class="preview-page-coms-icon"></i>组件管理</div>
<!--          <div @click="saveData" :class="{active:previewActiveIndex===2}" class="item preview-page-save"><i class="preview-page-coms-icon"></i>数据保存</div>-->
<!--          <div :class="{active:previewActiveIndex===3}" class="item preview-page-more"><i class="preview-page-coms-icon"></i>更多操作</div>-->
        </div>
        <preview-component ref="preview" @setData="setDataEv"></preview-component>
      </div>
      <div class="setattr">
        <div class="deco-component-title">
          <div class="deco-component-title__header"><span class="deco-component-title__name">{{componentTitle.title}}</span></div>
          <div class="deco-component-title__msg">{{componentTitle.desc}}</div>
        </div>
        <set-attr-component v-show="mode=='attr'" ref="setAttr"></set-attr-component>
        <common-attr-component v-show="mode=='system'" ref="setAttr"></common-attr-component>
        <right-component  v-show="mode=='plugin'"></right-component>
      </div>
    </div>
    <div class="handle">
      <el-button @click="saveData" type="primary" size="small">保存</el-button>
      <el-button @click="saveData" size="small">上架</el-button>
      <el-button @click="saveData" size="small">保存并上架</el-button>
      <el-button @click="viewEv" size="small">缩略图</el-button>
<!--      <el-button size="small">更多操作</el-button>-->
    </div>

<!--    <div class="right">-->
<!--      -->
<!--    </div>-->

  </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {mapState,mapActions} from 'vuex';
    import SetAttrComponent from '@/components/SetAttrComponent.vue'; // @ is an alias to /src
    import PreviewComponent from '@/components/PreviewComponent.vue';
    import CommonAttrComponent from '@/components/CommonAttrComponent.vue';
    import PluginsComponent from '@/components/PluginsComponent.vue';
    import RightComponent from '@/components/RightComponent.vue';
    import {moveEl} from '@/common/utils';

    import {isDev} from '../common/env';


    import html2canvas from 'html2canvas';
    import {Canvas2Image} from '@/assets/js/diy/tool/canvas2img';
    import {uploadImgByBase64} from '@/common/fetch';

    @Component({
        components: {
            PluginsComponent,
            SetAttrComponent,
            PreviewComponent,
            RightComponent,
            CommonAttrComponent
        },
        data() {
            return {
                isDev: isDev,
                previewActiveIndex:null,
                imgUrl:'',
                title:'自定义页面'
            }
        },
        methods: {
            async convert2canvas(el) {
                let shareContent = el //需要截图的包裹的（原生的）DOM 对象
                let width = shareContent.offsetWidth //获取dom 宽度
                let height = shareContent.offsetHeight //获取dom 高度
                let canvas = document.createElement('canvas') //创建一个canvas节点
                let scale = 2 //定义任意放大倍数 支持小数
                canvas.width = width * scale //定义canvas 宽度 * 缩放
                canvas.height = height * scale //定义canvas高度 *缩放
                canvas.getContext('2d').scale(scale, scale) //获取context,设置scale
                let opts = {
                    scale: scale, // 添加的scale 参数
                    canvas: canvas, //自定义 canvas
                    // logging: true, //日志开关，便于查看html2canvas的内部执行流程
                    width: width, //dom 原始宽度
                    height: height,
                    useCORS: false // 【重要】开启跨域配置
                }
                await html2canvas(shareContent, opts).then(canvas => {

                    console.log(canvas)
                    let context = canvas.getContext('2d')
                    // 【重要】关闭抗锯齿
                    context.mozImageSmoothingEnabled = false
                    context.webkitImageSmoothingEnabled = false
                    context.msImageSmoothingEnabled = false
                    context.imageSmoothingEnabled = false
                    // 【重要】默认转化的格式为png,也可设置为其他格式
                    // return this.imgUrl = Canvas2Image.convertToPNG(canvas, canvas.width, canvas.height).getAttribute('src');
                    let src = Canvas2Image.convertToPNG(
                        canvas,
                        canvas.width,
                        canvas.height
                    ).getAttribute('src')
                    console.log(src)

                    let base64Data = src;
                    //let blob = this.dataURItoBlob(src)
                    // let file = new File(
                    //     [blob],
                    //     (this.title || '自定义页面') + '.png'
                    // )
                    //let data = new FormData()
                    //data.append('file', file)

                    //,'title':this.title || '自定义页面'+'png'
                    let data = {data:base64Data};

                    return uploadImgByBase64(data).then(res => {
                        this.imgUrl = res.data.url
                    })
                })
            },
            dataURItoBlob(base64Data) {
                let byteString
                if (base64Data.split(',')[0].indexOf('base64') >= 0)
                    byteString = atob(base64Data.split(',')[1])
                else byteString = unescape(base64Data.split(',')[1])
                let mimeString = base64Data
                    .split(',')[0]
                    .split(':')[1]
                    .split(';')[0]
                let ia = new Uint8Array(byteString.length)
                for (let i = 0; i < byteString.length; i++)
                    ia[i] = byteString.charCodeAt(i)
                return new Blob([ia], { type: mimeString })
            },
            async viewEv(boolean, name) {

                //截图
                let el = document.getElementById('canvas')
                await this.convert2canvas(el)

                //let data = JSON.stringify(this.activeTemplateData)
                //let modelIndex = this.$route.query.id
                var postData = {}

                //postData.title = this.title

                //postData.config = data
                postData.cover = this.imgUrl
                // postData.name = ''

                console.log(postData);
                return;

                if (this.is_edit_id) {
                    // postData.ids = this.is_edit_id;

                    // manageEdit({row:postData,ids:this.is_edit_id}).then(() => {
                    //     return this.$Message.success('修改成功！')
                    // }).catch(e=>{})

                }else{
                    // manageAdd({row:postData,group:2}).then(
                    //     () => {
                    //         return this.$Message.success('保存成功！')
                    //     }
                    // ).catch(e=>{})
                }
            },
            ...mapActions(['setMode','setComponentTitle']),
            setAct(idx,mode,title,desc){
                this.previewActiveIndex=idx;
                this.setMode(mode);
                this.setComponentTitle({title,desc})
            },
            // 这个数据一直往上传，这么辛苦
            setDataEv(data) {
                // this.activeObj = data
            },
            saveData(){
                // this.previewActiveIndex=2;
                this.$refs.preview.uploadConfig();

            }
        },
        computed: {
            ...mapState(['activeAttr', 'editStatus','mode','componentTitle']),
        },
        mounted() {
            // 右侧如果内容过多，可以用滚动栏
            //moveEl(this.$refs.setAttr.$el);
        },
    })
    export default class Home extends Vue {
        created() {

            console.log(this)
            //模拟设置一下
            // getShopSkinList().then(res=>{
            //
            //     chooseShopSkin({Skin_ID:res.data.shop_skin_list[0].Skin_ID}).then(r=>{
            //
            //     })
            // })
        }
    }
</script>
<style lang="stylus" scoped>
  /*.mainHeader*/

  /*  padding 16px 0*/
  /*  box-sizing border-box*/
  /*  text-align right*/
  /*  border-bottom 1px solid #e7e7e7*/
  .handle
    position fixed
    z-index 999
    bottom 0
    width 100%
    height 50px
    display flex
    align-items center
    background white
    justify-content center
    border-top 1px solid #e7e7e7

  .wrap
    padding-top 0px
    margin 0px auto 0

    .plugins
      width 186px
      padding 0 12px
      box-sizing border-box

    .preview
      position relative
      flex 1
      //height calc(100vh - 70px)
      height 100vh
      /*box-sizing border-box*/
      /*padding-top 70px*/
      overflow-x hidden
      overflow-y auto
      background #f7f8fa
      //min-height: 601px;


    .setattr
      height calc(100vh - 70px)
      /*overflow-y scroll*/
      padding-bottom 70px
      overflow-x hidden
      /*width 460px*/
      width 540px
      /*padding-right 20px*/

  .right
    position fixed
    z-index 999
    right 0px
    width 140px
    background white
    bottom 0
    top 100px
    /*overflow-y scroll*/
    border 1px solid #e7e7e7


  /*webkit内核*/
  //.setattr::-webkit-scrollbar {
  //  width:0px;
  //  height:0px;
  //}
</style>
<style lang="less">
.preview::-webkit-scrollbar {
  display: none;
}

.setattr::-webkit-scrollbar {
  display: none;
}

#preview{
  /*overflow-x:hidden;*/
  /*overflow-y :auto;*/
  /*position: absolute;*/
  /*top: 0;*/
  /*bottom: 0;*/
  /*width: 100%;*/
}

.preview-page{
  position: absolute;
  top: 70px;
  right: 10px;
  text-align: center;
  font-size: 12px;
  color: #323233;
  z-index: 1;
  .item{
    background-color: #fff;
    box-shadow: 0 2px 8px 0 rgba(0,0,0,.1);
    border-radius: 2px;
    width: 94px;
    height: 32px;
    line-height: 32px;
    margin-bottom: 12px;
    cursor: pointer;
    &.active{
      background-color: #66b1ff;
      color: #fff;
    }
    &.preview-page-save:hover{
      background-color: #66b1ff;
      color: #fff;
    }
    &.preview-page-more:hover{
      background-color: #66b1ff;
      color: #fff;
    }
  }
}


.deco-component-title{
  padding: 24px 16px;
  border-bottom: 1px solid #f2f4f6;
}

.deco-component-title__name {
  margin-right: auto;
  font-size: 18px;
  font-weight: 600;
  line-height: 24px;
  color: #323233;
  text-align: left;
}
.deco-component-title__msg {
  margin-top: 12px;
  font-size: 14px;
  line-height: 20px;
  color: #969799;
}
</style>
