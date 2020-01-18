<template>
  <div>
    <div class="component-title">
      <div class="component-title__header"><span class="component-title__tip"></span><span class="component-title__name">素材模板</span></div>
<!--      <div class="component-title__msg">选择合适的模板直接使用</div>-->
    </div>
    <div class="tmpl-list" v-loading="loadingTmpl">
      <vue-scroll :ops="ops">
        <div @click="selectTmpl(tmpl.id)" class="tmpl-item" v-for="(tmpl,idx) in tmpls" :key="idx" :style="{marginRight:(idx+1)%2==0?'0':''}">
          <div class="tmpl-item-cover" :style="{backgroundImage:'url('+tmpl.img+')'}"></div>
          <div class="del-btn" @click.stop="delTmplFn(tmpl.id)">删除模板</div>
        </div>
      </vue-scroll>

    </div>
  </div>
</template>

<script lang="ts">
  import {
    Vue,
    Component
  } from 'vue-property-decorator'
  import {
    delPoster,
    getFileList, getPosterDetail,
    getPosterList
  } from "../../../common/fetch";

  @Component
  export default class TemplateList extends Vue{

    ops = {
      // some configs....
      rail:{
        background: '#409EFF',
        opacity: 0,
      },
      bar:{
        background: '#409EFF',
        opacity:.4
      }
    }
    tmpls = []


    loadingTmpl = false

    async getTmplList(){

      this.loadingTmpl = true

      let ret = await getPosterList({pageSize:999})
      this.tmpls = ret.data

      this.loadingTmpl = false

    }

    delTmplFn(id){
      this.$confirm('是否删除模板?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delPoster({id}).then(res=>{
          this.getTmplList()
        })
      }).catch(() => {

      });
    }


    selectTmpl(id){
      this.$parent.$refs.console.loadingImageInstance = true
      getPosterDetail({id}).then(res=>{
        this.$parent.$refs.console.initByTmpl(res.data.data)
        this.$parent.$refs.console.loadingImageInstance = false
      })

    }
    created(){


      this.getTmplList()


      // getFileList({attach_path:'image/design/',type:'image'}).then(res=>{
      //
      //
      //   for(let img of res.data){
      //     if(!img.is_dir){
      //       this.tmpls.push({
      //         thumb:img.fileurl,
      //         title:img.filename
      //       })
      //     }
      //   }
      //
      // })
    }

  }
</script>

<style lang="less" scoped>

  .component-title{
    padding: 10px 16px;
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

  .tmpl-list{
    /*display: flex;*/
    /*flex-wrap: wrap;*/
    margin: 0 auto;
    width: 320px;
    height: calc(100vh - 50px);
    .tmpl-item{
      float: left;
      width: 146px;
      height: 256px;
      margin: 5px 10px 10px 0px;
      cursor: pointer;
      box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
      position: relative;
      background-color: rgba(0, 0, 0, 0.05);
      &:hover{
        .tmpl-item-cover{
          background-size: 110% 110%;
        }
        .del-btn{
          visibility: visible;
        }
      }
      .del-btn{
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);
        padding: 0 20px;
        color: #444;
        border:1px solid #fff;
        background: #fff;
        line-height: 32px;
        height: 32px;
        white-space: nowrap;
        text-align: center;
        font-size: 14px;

        visibility: hidden;
      }
      .tmpl-item-cover{
        /*position: absolute;*/
        width: 100%;
        height: 100%;
        background-repeat: no-repeat;
        background-size:100% 100%;
        background-position: center;
        transition: all .2s;
      }
    }
  }



</style>
