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
        <preview-component @preFun="setPreEv" ref="preview" @setData="setDataEv"></preview-component>
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
      <el-button @click="saveData(0)" type="primary" size="small">保存</el-button>
<!--      <el-button @click="saveData(1)" size="small">上架</el-button>-->
      <el-button @click="saveData(1)" size="small">保存并上架</el-button>
      <div class="preBox" >
        <el-button @click="saveData(0,1)" size="small">预览</el-button>
        <div class="tooltip" v-show="centerDialogVisible" @click="centerDialogVisible=false">
          <div class="qrcode"><qrcode-vue :value="preUrl" size="100" level="H"></qrcode-vue></div>
          <div class="font12" style="line-height: 20px;height: 20px">扫一扫预览</div>
        </div>
      </div>

<!--      <el-button size="small">更多操作</el-button>-->
    </div>

<!--    <el-dialog-->
<!--      title="扫码预览"-->
<!--      :visible.sync="centerDialogVisible"-->
<!--      width="30%"-->
<!--      center>-->
<!--      <div style="text-align: center">-->
<!--        -->
<!--      </div>-->
<!--      <span slot="footer" class="dialog-footer">-->
<!--        <el-button @click="centerDialogVisible = false">取 消</el-button>-->
<!--        <el-button type="primary" @click="centerDialogVisible = false">确 定</el-button>-->
<!--      </span>-->
<!--    </el-dialog>-->

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

    import {ss} from '@/common/tool/ss';
    import {isDev,front_url} from '../common/env';

    import Cookies from 'js-cookie';

    import QrcodeVue from 'qrcode.vue';

    const serialize = function(obj) {
        var ary = [];
        for (var p in obj)
            if (obj.hasOwnProperty(p) && (obj[p] || obj[p]== 0 || obj[p] =='' )) {
                ary.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
            }
        return ary.join('&');
    };




    @Component({
        components: {
            PluginsComponent,
            SetAttrComponent,
            PreviewComponent,
            RightComponent,
            CommonAttrComponent,
            QrcodeVue
        },
        data() {
            return {
                isDev: isDev,
                preUrl:'',
                centerDialogVisible:false,
                previewActiveIndex:null
            }
        },
        methods: {

            ...mapActions(['setMode','setComponentTitle']),
            setpreUrl(){

                let Skin_ID =  ss.get('Skin_ID'),
                    Home_ID =  ss.get('Home_ID'),
                    Users_ID = Cookies.get('Users_ID');

                let obj = {Skin_ID,Home_ID,users_id:Users_ID};

                let str = serialize(obj);

                if(str)str = '?'+str;

                console.log('更新preurl',this.preUrl);

                this.preUrl = front_url+'pages/index/pre'+str;

            },
            setAct(idx,mode,title,desc){
                this.previewActiveIndex=idx;
                this.setMode(mode);
                this.setComponentTitle({title,desc})
            },
            // 这个数据一直往上传，这么辛苦
            setDataEv(data) {

            },
            setPreEv(val){

                this.setpreUrl();
                this.centerDialogVisible = val
            },
            saveData(use,pre){
                // this.previewActiveIndex=2;
                this.$refs.preview.uploadConfig(use,pre);


            }
        },
        computed: {
            //预览网址

            ...mapState(['activeAttr', 'editStatus','mode','componentTitle']),
        },
        mounted() {
            // 右侧如果内容过多，可以用滚动栏
            //moveEl(this.$refs.setAttr.$el);
        },
        created() {

            this.setpreUrl();

        }
    })
    export default class Home extends Vue {

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

.preBox{
  margin-left: 10px;
  position: relative;
  .tooltip{
    position: absolute;
    bottom: 50px;
    left: -20px;
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
  position: fixed;
  top: 70px;
  right: 550px;
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
