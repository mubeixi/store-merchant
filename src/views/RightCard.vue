<template>
  <div class="labelManagement">
      <fun-table
        ref="funTableComp"
        vkey="Products_ID"
        :has="selectValue"
        :showSave=true
        :columns="dataTableOpt.columns"
        :dataList="dataTableOpt.dataList"
        :act="dataTableOpt.act"
        :_totalCount="dataTableOpt.totalCount"
        :_pageSize="dataTableOpt.pageSize"
        :is_paginate="dataTableOpt.is_paginate"
        :formSize="'small'"
        :isRow="false"
        @closeDialog="closeDialog"
        @handleSizeChange="handleSizeChange"
        @currentChange="currentChanges"
        @selectVal="selectVal"
        @submit="submit"
        @reset="reset"
      >
        <template slot="coupons-column" slot-scope="props" >
          <div v-for="(item,index) of props.row.coupons" :key="index">
            优惠券名称：{{item.Coupon_Subject}}  满{{item.Coupon_Condition}}减{{item.Coupon_Cash}}元
          </div>
        </template>
        <template slot="status-column"  slot-scope="props">
          <span>{{props.row.status==1?'正常':'禁用'}}</span>
        </template>
      </fun-table>
  </div>
</template>

<script lang="ts">
  import {
    Component,
    Vue,
    Watch
  } from 'vue-property-decorator';
  import UploadComponents from "@/components/comm/UploadComponents.vue";
  import {findArrayIdx, plainArray, createTmplArray, objTranslate} from '@/common/utils';
  import {
    getRightsCard
  } from '@/common/fetch'
  @Component({
    mixins:[],
    components: {
      UploadComponents
    }
  })

  export default class RightCard extends Vue {

    closeDialog(){}
    settingShow=false
    cate=[]
    dataTableOpt = {
      act : 'get_self_store_prod',
      dataList:[],
      page:1,
      totalCount:100,
      pageSize:10,
      is_paginate:true,//是否显示分页 默认显示
      columns : [
        {
          prop: "card_name",
          label: "名称",
          value:'',
          // width:120,
          align:'center',
          field: "card_name",
          required: true,
          search: {
            type: 'input',
            operate: 'like',
          }
        },
        {
          prop: "price",
          label: "价格",
          // width:120,
          align:'center',
          search: false
        },
        {
          prop: "coupons",
          label: "礼包",
          // width:120,
          align:'center',
          search: false
        },
        {
          prop: "created_at",
          label: "创建时间",
          align:'center',
          // width:150,
          search: false
        },
        {
          prop: "status",
          label: "状态",
          align:'center',
          value:'',
          search: {
            type: 'select',
            operate: 'like',
            option:[{label:'正常',value:1},{label:'禁用',value:0}]
          }
        }
      ]
    }

    selectValue=[]
    productData=[]
    //获取选中数据
    selectVal(val,vals){
      console.log(val,vals,"sssss")
      this.selectValue=[]
      this.productData=[]

      for(let item of val){
        this.productData.push(item)
        if(this.selectValue.indexOf(item.Products_ID)==-1){
          this.selectValue.push(item.Products_ID)
          //this.productData.push(item)
        }
      }
      for(let it of  vals){
        for(let i=0;i<this.selectValue.length;i++){
          if(this.selectValue[i]==it.Products_ID){
            this.selectValue.splice(i,1)
            //this.productData.splice(i,1)
          }
        }
      }

    }
    //重置
    reset(){
      console.log("11111111")
      for(let it in this.dataTableOpt.columns){
        this.dataTableOpt.columns[it].value=''
      }
      this.selectValue=[]
      this.getProduct()
    }
    //搜索
    submit(){
      this.getProduct()
    }
    //一页多少行
    handleSizeChange(val){
      this.dataTableOpt.pageSize=val
      this.getProduct()
    }
    //当前页数
    currentChanges(val){
      this.dataTableOpt.page=val
      this.getProduct()
    }
      getProduct(){
      let nameIdx = findArrayIdx(this.dataTableOpt.columns,{prop:'card_name'})
      let oattrIdx = findArrayIdx(this.dataTableOpt.columns,{prop:'status'})
      let data={
        pageSize: this.dataTableOpt.pageSize,
        page:this.dataTableOpt.page,
        card_name:this.dataTableOpt.columns[nameIdx].value,
        //status:this.dataTableOpt.columns[oattrIdx].value,
        store_id:''
      }
      if(this.dataTableOpt.columns[oattrIdx].value===1||this.dataTableOpt.columns[oattrIdx].value===0){
        data.status=this.dataTableOpt.columns[oattrIdx].value
      }


      getRightsCard(data).then(res=>{
        if(res.errorCode==0){
          this.dataTableOpt.dataList=res.data
          this.dataTableOpt.totalCount=res.totalCount
        }
      })
    }

    async created(){
      this.getProduct()
    }


  }

</script>

<style scoped lang="less">
  .labelMain{
    padding: 20px 0px;
    .marginLR{
      margin-left: 30px;
    }
    .marginLRS{
      margin-left:30px;
    }
  }
  .inputMyDa /deep/ .el-input__inner{
    padding-left: 10px;
  }
  .divFlex{
    display: flex;
  }
  .labelCenter{
    display: flex;
    .labelDiv{
      font-size: 7px;
      color: #BCBCBC;
      margin-top: 25px;
      margin-left: 12px;
    }
  }
  .labelCenter /deep/ .el-form-item__label{
    margin-top: 25px;
  }
  .marginRight{
    margin-right: 20px;
    font-size: 8px;
    color: #777777;
  }
  .inputMargin{
    margin-left: 10px;
    margin-right: 6px;
    width: 85px;
  }
  .widthInput{
    width: 85px;
  }
  .fontSize{
    color: #BCBCBC;
    font-size: 12px;
    width: 630px;
    margin-top: 10px;
  }
  .myCenter{
    margin-top: 10px;
    background-color: #F8F8F8;
    padding: 11px 152px 21px 17px;
    .first{
      margin-left: 18px;
      margin-bottom: 15px;
      background-color: #ffffff;
      padding: 10px 50px 20px 16px;
      .spans{
        font-size: 12px;
        color: #BCBCBC;
        margin-left: 17px;
      }
    }
    .productRadio{
      display: inline-block;
      height: 32px;
      line-height: 32px;
      margin-left: 20px;
    }
  }
  .selects{
    color: #428CF7;
    font-size: 12px;
    margin-left: 10px;
    cursor: pointer;
    display: inline-block;
  }

  .second{
    padding: 5px 22px 12px 16px !important;
    .listLine{
      height: 46px;
      display: flex;
      align-items: center;
      border-bottom: 1px dotted #DBDBDB;
      .lineImg{
        width: 30px;
        height: 30px;
      }
      .lineDiv{
        color: #999999;
        font-size: 12px;
        margin-left: 14px;
      }
    }
  }

  .oneFont{
    font-size: 14px;margin-left: 8px;color: #777777
  }
  .inputMy{
    width: 75px;margin-left: 24px
  }
  .inputT{
    margin-left: 20px;
    & /deep/ .el-input__inner{
      padding-right: 0px;
    }
  }
  .marginBo{
    margin-bottom: 20px;
  }
  .addSpan{
    color: #428CF7;
    font-size: 12px;
    margin-left: 12px;
    cursor: pointer;
  }
  .submit{
    margin-left: 380px;
    margin-top: 84px;
    .close{
      margin-right: 20px;
    }
  }

  .amu{
    background-color: #F8F8F8;
    width: 925px;
    padding: 24px 95px 38px 42px;
    box-sizing: border-box;
    border: 1px solid #EEEEEE;
    margin-top: 10px;
    .th{
      background-color: #F2F7FF;
      display: flex;
      align-items: center;
      height: 48px;
      .td{
        text-align: center;
        width: 220px;
        border-right: 1px solid #EEEEEE;
        &:last-child{
          border: 0px;
        }
      }
    }
    .widthmbx{
      width: 120px;
    }
    .tr{
      height: 60px;
      display: flex;
      align-items: center;
      background-color: #ffffff;
      border-top:1px solid #EEEEEE;
      .td{
        width: 220px;
        height: 60px;
        line-height: 60px;
        text-align: center;
        border-right: 1px solid #EEEEEE;
        &:last-child{
          border: 0px;
        }
      }
    }
  }
  /*赠品*/
  .cardTitle{
    display: flex;
    align-items: center;
  }
  .current{
    cursor: pointer;
    color: #79B0FF;
    margin-left: 10px;
  }
  .fixDisplay{
    display: flex;
    align-items: center;
  }
  .lst{
    margin-left: 10px;
    width: 100px;
    overflow: hidden;
    height: 17px;
    line-height: 23px;
    display: inline-block;
  }
  /deep/ .el-table__row  {
    cursor: pointer;
  }
  .myProduct /deep/ .el-dialog{
    height: 600px;
    overflow: auto;
  }

</style>
