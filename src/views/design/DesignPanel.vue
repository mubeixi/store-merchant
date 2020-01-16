<template>
  <div class="home-wrap">
    <div class="flex main">
      <div class="tmpl">
        <template-list ref="tmpl"></template-list>
      </div>
      <div class="console" >
        <design-console ref="console" @setData="setDataEv"></design-console>
      </div>
      <div class="resource">
        <resource-list ref="resource"></resource-list>
      </div>
    </div>


  </div>
</template>

<script lang="ts">
  import {
    Vue,
    Component,
    Watch
  } from 'vue-property-decorator';

  import TemplateList from './components/TemplateList.vue'
  import DesignConsole from './components/DesignConsole'
  import ResourceList from './components/ResourceList'

  @Component({
    components:{
      TemplateList,
      DesignConsole,
      ResourceList
    }
  })
  export default class DesignPanel extends Vue{
    setDataEv(){

    }
  }
</script>

<style lang="less"  scoped>
  .home-wrap{
    padding-top:0px;
    margin:0px auto 0;
    .tmpl{
      width: 356px;
      background: #ebebf0;
      box-shadow: 1px 0px 3px rgba(0, 0, 0, 0.03);
      overflow-x: hidden;
    }
    .console{
      position:relative;
      flex:1;
      height:100vh;
      overflow-x:hidden;
      overflow-y:auto;
      background: #dcdcdc;
    }
    .resource{
      height:100vh;
      overflow-x:hidden;
      width:140px;
      box-sizing: border-box;
      padding: 0px;
      background: #ebebf0;
      box-shadow: -1px 0px 3px rgba(0, 0, 0, 0.03);
    }
  }




  .preview::-webkit-scrollbar {
    display: none;
  }
  .setattr::-webkit-scrollbar {
    display: none;
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
</style>
