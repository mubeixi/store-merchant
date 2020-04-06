<template>
  <div class="page-wrap p-20">

    <div class="cate-div">
      <span class="select-cate">企业入驻资料设置:</span>
      <el-popover
        placement="top"
        width="160"
        trigger="manual"
        v-model="companyPopVisible"
      >
        <div class="p-10">
          <el-select v-model="companyAddTypeIdx" size="mini" placeholder="请选择" class="width-120">
            <el-option
              v-for="(item,idx) in eleTypeList"
              :key="idx"
              :label="item.title"
              :value="idx">
            </el-option>
          </el-select>
        </div>
        <div style="text-align: right; margin: 0">
          <el-button size="mini" type="text" @click="companyPopVisible =false">取消</el-button>
          <el-button @click="companyAddRow" type="primary" size="mini" >确定</el-button>
        </div>
        <span slot="reference" class="select-cate-right" @click.prevent="openCompanyAdd">添加</span>
      </el-popover>
    </div>
    <form-wrap v-if="ready" :_conf="companyData" @change="upCompanyData" ref="company"></form-wrap>
    <div class="p-30"></div>
    <div class="cate-div">
      <span class="select-cate">个人入驻资料设置:</span>
      <el-popover
        placement="top"
        width="160"
        trigger="manual"
        v-model="personPopVisible"
      >
        <div class="p-10">
          <el-select v-model="personAddTypeIdx" size="mini" placeholder="请选择" class="width-120">
            <el-option
              v-for="(item,idx) in eleTypeList"
              :key="idx"
              :label="item.title"
              :value="idx">
            </el-option>
          </el-select>
        </div>
        <div style="text-align: right; margin: 0">
          <el-button size="mini" type="text" @click="personPopVisible =false">取消</el-button>
          <el-button @click="personAddRow" type="primary" size="mini" >确定</el-button>
        </div>
        <span slot="reference" class="select-cate-right" @click.prevent="openPersonAdd">添加</span>
      </el-popover>
    </div>
    <form-wrap v-if="ready" :_conf="personData" @change="upPersonData" ref="person"></form-wrap>
    <div class="flex m-t-40">
      <el-button size="small" @click="sub" type="primary">提交</el-button>
      <el-button size="small" @click="cancel" type="info">取消</el-button>
    </div>

  </div>
</template>

<script>
  import {
    Component,
    Vue
  } from 'vue-property-decorator'
  import FormWrap from "../components/form/FormWrap";
  import {fun} from "../common";
  import {
    updateBizConfig,getBizConfig
  } from "../common/fetch";


  @Component({
    components: {FormWrap}
  })
  export default class JoinMaterial extends Vue {

    ready = false;

    personData = [];
    companyData = [];

    eleTypeList = [
      {title:'文本框',type:'input'},
      {title:'选择框',type:'picker'},
      {title:'图片上传',type:'img'},
      {title:'地区选择',type:'area'},
    ]
    personPopVisible = false
    personAddTypeIdx = 0

    companyPopVisible = false
    companyAddTypeIdx = 0

    openCompanyAdd(){
      this.companyAddTypeIdx = 0
      this.companyPopVisible = true
    }

    companyAddRow(){
      this.companyPopVisible = false
      if(!this.eleTypeList[this.companyAddTypeIdx]){
        fun.error({msg:'请选择新增的表单组件类型'})
        return;
      }
      this.$refs.company.rowAdd(this.eleTypeList[this.companyAddTypeIdx])
    }


    openPersonAdd(){
      this.personAddTypeIdx = 0
      this.personPopVisible = true
    }

    personAddRow(){
      this.personPopVisible = false
      if(!this.eleTypeList[this.personAddTypeIdx]){
        fun.error({msg:'请选择新增的表单组件类型'})
        return;
      }
      this.$refs.person.rowAdd(this.eleTypeList[this.personAddTypeIdx])
    }

    upPersonData(arr){
      this.personData = arr.concat([])
    }

    upCompanyData(arr){
      this.companyData = arr.concat([])
    }

    sub(){
      const data = {
        'company':this.companyData,
        'person':this.personData
      }
      const postData = {industry_form:JSON.stringify(data)}

      updateBizConfig(postData).then(res => {
        fun.success({msg:'修改成功'})
      }).catch(()=>{

      })

    }

    cancel(){
      history.go(-1)
    }

    async created(){

      getBizConfig().then(res => {
        const {company=[],person=[]} =res.data.industry_form
        this.personData = person
        this.companyData = company
        this.ready = true
      }).catch(err => {

      })

    }

  }

</script>

<style scoped lang="less">
  .cate-div{
    font-size: 14px;
    margin-top: 17px;
    margin-bottom: 17px;
    height: 12px;
    line-height: 12px;
  }
  .select-cate{
    color: #606266;
    margin-right: 16px;
  }
  .select-cate-right{
    color: #409EFF;
    cursor: pointer;
  }


</style>
