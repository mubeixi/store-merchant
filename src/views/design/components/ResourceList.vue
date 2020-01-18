<template>
  <div>
    <div class="component-title">
      <div class="component-title__header"><span class="component-title__tip"></span><span class="component-title__name">显示元素</span></div>
<!--      <div class="component-title__msg">选择合适的模板直接使用</div>-->
    </div>
    <div class="actions line15 padding10-c">

      <el-checkbox @change="headimgHandle" v-model="headimg" label="头像"></el-checkbox>
      <el-checkbox @change="nicknameHandle" v-model="nickname" label="昵称"></el-checkbox>
      <el-checkbox @change="qrcodeHandle" v-model="qrcode" label="二维码"></el-checkbox>
      <el-checkbox @change="timeHandle" v-model="time" label="时间"></el-checkbox>

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



    headimg = false
    headimgHandle(val){
      console.log('headimg value is = ',val)
      if(val){
        this.$parent.$refs.console.createArea('headimg')
      }else{
        this.$parent.$refs.console.deletedArea('headimg')
      }

    }

    /**
     * 根据配置初始化右侧选择情况  毕竟可能是从服务器上拿到的数据，带初始化的。
     * @param rightCheck
     */
    refresh(rightCheck=[]){

      this.headimg = rightCheck.includes('headimg')
      this.nickname = rightCheck.includes('nickname')
      this.time = rightCheck.includes('time')
      this.qrcode = rightCheck.includes('qrcode')

    }

    nickname = false
    nicknameHandle(val){
      if(val){
        this.$parent.$refs.console.createArea('nickname')
      }else{
        this.$parent.$refs.console.deletedArea('nickname')
      }

    }
    qrcode = false
    qrcodeHandle(val){
      if(val){
        this.$parent.$refs.console.createArea('qrcode')
      }else{
        this.$parent.$refs.console.deletedArea('qrcode')
      }
    }
    time = false
    timeHandle(val){
      if(val){
        this.$parent.$refs.console.createArea('time')
      }else{
        this.$parent.$refs.console.deletedArea('time')
      }
    }

    sourceDrag(e:any){
      const url = e.target.getAttribute('src');
      e.dataTransfer.setData('file-url', url);
    }

    createdText(){
      this.$parent.$refs.console.createText('文字')
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
    height: calc(100vh - 250px);
    .resource-item{
      width: 100px;
      margin: 0 auto;
      .img{
        width: 100%;
        cursor: pointer;
      }
    }
  }
</style>
