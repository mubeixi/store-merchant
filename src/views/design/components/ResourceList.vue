<template>
  <div>
    <div class="component-title">
      <div class="component-title__header"><span class="component-title__tip"></span><span class="component-title__name">显示元素</span></div>
<!--      <div class="component-title__msg">选择合适的模板直接使用</div>-->
    </div>
    <div class="action line15 text-center" @click="createdText">
      <el-button plain type="primary" size="small">+添加文本</el-button>
    </div>
    <div class="action line15 text-center" @click="openFinder">
      <el-button type="primary" size="small">+导入图片</el-button>
    </div>
    <div class="resource-list">
      <vue-scroll :ops="ops">
        <div class="resource-item" v-for="(file,idx) in files" :key="idx" >
          <img draggable="true"  @dragstart="sourceDrag" class="img" :src="file" />
        </div>
      </vue-scroll>
    </div>
  </div>
</template>

<script  lang="ts">
  import {
    Vue,
    Component
  } from 'vue-property-decorator'
  import {
    Action,
    State
  } from 'vuex-class'
  import {FUNFinder} from "../../../components/editor/ckeditt-resource/FUNFinder";

  @Component
  export default class ResourceList extends Vue{

    sourceDrag(e:any){
      const url = e.target.getAttribute('src');
      e.dataTransfer.setData('file-url', url);
    }

    createdText(){
      this.$parent.$refs.console.createdText('文字')
    }

    openFinder(){
      FUNFinder.open({options:{limit:10,allow:['image']},callFn:{choose:this.upPicCallFn}})
    }

    files = []
    upPicCallFn(urls){

      this.files = this.files.concat(urls)
    }


    ops = {
      rail:{
        background: '#409EFF',
        opacity: 0,
      },
      bar:{
        background: '#409EFF',
        opacity: .4,
      }
    }

  }
</script>

<style lang="less" scoped>

  .component-title{
    padding: 10px 10px;
    /*border-bottom: 1px solid #f2f4f6;*/
    .component-title__header{
      display: flex;
      align-items: center;
      .component-title__tip{
        width: 2px;
        height: 16px;
        background: #409EFF;
      }
      .component-title__name{
        padding-left: 10px;
        color: #333;
      }
    }
    .component-title__msg{
      color: #666;
      font-size: 14px;
      margin-top: 10px;
    }
  }

  .resource-list{
    height: calc(100vh - 140px);

    .resource-item{
      width: 100px;
      margin: 0 auto;
      .img{
        width: 100%;
      }
    }
  }
</style>
