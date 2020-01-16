<template>
  <div class="diy-wrap">
    <div class="flex main">
      <div class="plugins">
        <plugins-component></plugins-component>
      </div>
      <div class="preview" id="preview">
        <div class="preview-page">
          <div @click="setAct(0,'system','全局设置','针对页面的整体配置')" :class="{active:mode==='system'}" class="item preview-page-options"><i class="preview-page-options-icon"></i>全局设置</div>
          <div @click="setAct(1,'plugin','组件管理','可以便捷拖动、删除组件')" :class="{active:mode==='plugin'}" class="item preview-page-coms"><i class="preview-page-coms-icon"></i>组件管理</div>
        </div>
        <preview-component :isDiy="true" @preFun="setPreEv" ref="preview" @setData="setDataEv"></preview-component>
      </div>
      <div class="setattr">
        <div class="deco-component-title">
          <div class="deco-component-title__header"><span class="deco-component-title__name">{{componentTitle.title}}</span></div>
          <div class="deco-component-title__msg">{{componentTitle.desc}}</div>
        </div>
        <set-attr-component v-show="mode=='attr'" ref="setAttr"></set-attr-component>
        <common-attr-component v-show="mode=='system'"></common-attr-component>
        <right-component  v-show="mode=='plugin'"></right-component>
      </div>
    </div>
    <div class="handle">
      <el-button @click="saveData(0)" type="primary" size="small">保存</el-button>
      <el-button v-if="is_dev" @click="clearPlugin" size="small" type="danger">清空组件</el-button>

      <div class="preBox" >
        <el-button @click="saveData(0,1)" size="small">预览</el-button>
        <div class="tooltip" v-show="centerDialogVisible" @click="centerDialogVisible=false">
          <div class="qrcode"><qrcode-vue :value="preUrl" size="200" level="H"></qrcode-vue></div>
          <div class="font12" style="line-height: 20px;height: 20px">扫一扫预览</div>
        </div>
      </div>
    </div>

  </div>
</template>

<script lang="ts">
    import {
        Component,
        Vue
    } from 'vue-property-decorator';
    import {
        Action,
        State
    } from 'vuex-class'

    import SetAttrComponent from '@/components/SetAttrComponent.vue'; // @ is an alias to /src
    import PreviewComponent from '@/components/PreviewComponent.vue';
    import CommonAttrComponent from '@/components/CommonAttrComponent.vue';
    import PluginsComponent from '@/components/PluginsComponent.vue';
    import RightComponent from '@/components/RightComponent.vue';

    import {ss} from '@/common/tool/ss';
    import {front_url} from '../common/env';

    // const front_url = process.env.VUE_APP_FRONT_URL

    import Cookies from 'js-cookie';
    import QrcodeVue from 'qrcode.vue';
    import {serialize} from '@/common/utils';
    import {tmplDiyMixin} from '@/common/mixin';
    import {isDev} from '../common/env';


    @Component({
        mixins:[tmplDiyMixin],
        components: {
            PluginsComponent,
            SetAttrComponent,
            PreviewComponent,
            RightComponent,
            CommonAttrComponent,
            QrcodeVue
        }
    })
    export default class Home extends Vue {

        is_dev = isDev
        preUrl = ''
        centerDialogVisible = false
        previewActiveIndex = null

        @Action('setMode') setMode
        @Action('setComponentTitle') setComponentTitle

        @State('activeAttr') activeAttr
        @State('mode') mode
        @State('editStatus') editStatus
        @State('componentTitle') componentTitle

        clearPlugin(){
            this.$refs.preview.clearPlugin()
        }

        mounted() {

        }
        created() {
            this.setpreUrl();
        }

        setpreUrl(){

            let Home_ID =  ss.get('Home_ID'),
                Users_ID = Cookies.get('Users_ID');

            let obj = {Home_ID,users_id:Users_ID};
            let str = serialize(obj);
            if(str)str = '?'+str;
            console.log('更新preurl',this.preUrl);
            this.preUrl = front_url+'pages/page/page'+str;

        }
        setAct(idx,mode,title,desc){
            this.previewActiveIndex=idx;
            this.setMode(mode);
            this.setComponentTitle({title,desc})
        }
        // 这个数据一直往上传，这么辛苦
        setDataEv(data) {

        }
        setPreEv(val){

            this.setpreUrl();
            this.centerDialogVisible = val
        }
        saveData(use,pre){
            //@ts-ignore
            this.$refs.preview.uploadConfig(use,pre);
        }

    }
</script>
<style lang="stylus" scoped>

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

  .diy-wrap
    padding-top 0px
    margin 0px auto 0

    .plugins
      padding 0 12px

    .preview
      position relative
      flex 1
      height 100vh
      overflow-x hidden
      overflow-y auto
      background #f7f8fa

    .setattr
      height calc(100vh - 70px)
      padding-bottom 70px
      overflow-x hidden
      width 540px

  .right
    position fixed
    z-index 999
    right 0px
    width 140px
    background white
    bottom 0
    top 100px
    border 1px solid #e7e7e7

</style>
<style lang="less"  scoped>

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
