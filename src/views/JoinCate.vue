<template>
  <div class="page-wrap p-20">
    <div class="form-item">
      <div class="label">排序：</div>
      <div class="content">
        <input v-model="weight" class="input w400" placeholder="请输入排序" />
      </div>
    </div>
    <div class="form-item">
      <div class="label">类别名称：</div>
      <div class="content">
        <input v-model="industry_name" class="input w400" placeholder="请输入类别名称" />
      </div>
    </div>
    <div class="form-item" @click="bindCateDialogShow=true">
      <div class="label">上级类目：</div>
      <div class="content parent">
        <div class="actions"><span class="color-blue m-r-10">{{parent.industry_name}}</span><span class="">设置类目</span></div>
<!--        <div class="box">-->
<!--          <div class="cate_list" style="margin-left: 120px;margin-bottom: 22px;" v-if="cate_list.length>0">-->
<!--            <span class="cate_item" v-for="(cate,idx) in show_cate_list">{{cate.Category_Name}}</span>-->
<!--          </div>-->
<!--        </div>-->
      </div>
    </div>

    <div class="form-item">
      <div class="label">类目图片：</div>
      <div class="content parent">
        <upload-img-components
          :small="true"
          :img-url="industry_img"
          class="myUploadImg"
          :onSuccess='uploadImgCB'
          type='avatar'>
        </upload-img-components>
      </div>
    </div>

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


    <bind-biz-cate-components
      :multiple="false"
      @cancel="bindCateCancel"
      :strictly="true"
      :has.sync="cate_list"
        :onSuccess="bindCateSuccessCall"
      :pageEl="pageEl"
      :show="bindCateDialogShow"/>

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
    updateBizConfig, getBizConfig, getBizIndustryDetail,addBizIndustry,editBizIndustry
  } from "../common/fetch";
  import UploadImgComponents from "@/components/diy/tool/UploadImgComponents";
  import _ from "underscore";
  import {domain, plainArray} from "@/common/utils";
  import BindBizCateComponents from "@/components/BindBizCateComponents";


  @Component({
    components: {BindBizCateComponents, UploadImgComponents, FormWrap}
  })
  export default class JoinCate extends Vue {


    pageEl = this
    show_cate_list = []
    bindCateDialogShow = false
    cate_list = []
    bindCateCancel(){
      this.bindCateDialogShow = false
    }
    bindCateSuccessCall(dataType, type, path, tooltip, dataObj, pageEl, idx2,ext){
      console.log('返回的数据',dataObj)
      this.pid = dataObj.id
      this.parent.industry_name = dataObj.industry_name
      this.bindCateDialogShow = false
    }

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

      const action = this.id ? editBizIndustry:addBizIndustry

      let postData = {
        industry_name:this.industry_name,
        industry_img:this.industry_img,
        pid:this.pid,
        weight:this.weight,
        industry_form:JSON.stringify({
          company:this.companyData,
          person:this.personData
        })
      }
      if(this.id){
        postData.industry_id = this.id
      }

      action(postData).then(res => {
        fun.success({msg:'操作成功'})
      }).catch(()=>{

      })

    }

    cancel(){
      history.go(-1)
    }

    id = null

    industry_name = ''

    industry_img = ''
    uploadImgCB(res) {
      if (!res.data.path){
        fun.error({title:'图片上传失败'})
        return;
      }
      this.industry_img = domain(res.data.path)
    }

    personData = []
    companyData = []

    pid = 0

    weight = 0

    parent = {industry_name:''}

    async created(){

      const industry_id = this.$route.query.id
      if(!industry_id)return;
      this.id = industry_id
      getBizIndustryDetail({industry_id}).then(res => {
        const {pid, industry_name="顶级目录", industry_img= '', industry_form,weight=0,parent={}} =res.data
        this.industry_name = industry_name
        this.industry_img = industry_img
        this.pid = pid
        this.weight = weight

        this.parent = parent

        const {company=[],person=[]} = industry_form
        this.personData = person
        this.companyData = company
        this.ready = true
      }).catch(err => {

      })


    }

  }

</script>

<style scoped lang="less">
  .form-item{
    margin-bottom: 22px;
    font-size: 14px;
    display: flex;
    .label{
      text-align: right;
      vertical-align: middle;

      color: #606266;
      line-height: 40px;
      padding: 0 12px 0 0;
      width: 90px;
      box-sizing: border-box;
    }
    .content{

      .input{
        display: inline-block;
        -webkit-appearance: none;
        background-color: #fff;
        background-image: none;
        border-radius: 4px;
        border: 1px solid #dcdfe6;
        box-sizing: border-box;
        color: #606266;
        font-size: inherit;
        height: 40px;
        line-height: 40px;
        outline: none;
        padding: 0 15px;
        transition: border-color .2s cubic-bezier(.645,.045,.355,1);
      }
    }
    .parent{
      .actions{
        height: 40px;
        line-height: 40px;
        cursor: pointer;
      }
      .box{
        background: #f8f8f8;
        padding: 20px;
        width: 360px;
      }
    }
  }

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
