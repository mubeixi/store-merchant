<template>
  <div class="free-all">
    <div class="free-content">

      <el-form ref="form"  label-width="180px">

        <el-form-item label="背景图：" >
          <div style="display: flex;margin-left: 14px">
            <upload-components
              size="mini"
              ref="thumb"
              :limit="1"
              tip="上传标识图片"
              :onSuccess="upThumbSuccessCall"
            />
          </div>
        </el-form-item>

        <el-form-item label="名称：">
          <div class="flex flex-align-c c8">
            <el-input class="inputs" v-model="card_name" style="width: 300px !important;"></el-input>

          </div>
        </el-form-item>
        <el-form-item label="价格：">
          <div class="flex flex-align-c c8">
            <el-input class="inputs" v-model="price" style="width: 150px !important;"></el-input> 元

          </div>
        </el-form-item>

        <el-form-item label="礼包内容：">

          <div style="margin-bottom: 10px">
            送积分

            <el-input class="inputs" v-model="card_content.score" style="width: 140px !important;"></el-input>分
            <span style="color: #999999;">（ 购买该权益卡一次性赠送购买者多少积分）</span>

          </div>
          <div>
            送优惠卷 <span   class="select" @click="openCoupon">选择优惠券</span>
            <div >
              <div class="coupons"  v-for="(item,index) of productData" :key="index">
                {{item.Coupon_Subject}}
                <img src="@/assets/img/productAdd/del.png" class="del-img" @click="del(index)">
              </div>
            </div>
          </div>
        </el-form-item>



        <el-form-item label="购买须知：">
          <el-input
            style="width: 480px"
            type="textarea"
            :autosize="{ minRows: 6, maxRows: 10}"
            placeholder="请输入内容"
            v-model="descr">
          </el-input>
        </el-form-item>


      </el-form>
    </div>

    <div class="submit-div">
      <div class="submit" @click="saveActive">保存</div>
    </div>




    <el-dialog
      title="选择优惠券"
      width="60%"
      @close="closeDialog"
      append-to-body
      :visible.sync="isShow"
      class="setting"
    >
      <fun-table
        v-if="isShow"
        ref="funTableComp"
        vkey="Coupon_ID"
        :has.sync="selectValue"
        :showSave=true
        :columns="dataTableOpt.columns"
        :dataList="dataTableOpt.dataList"
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
      </fun-table>
    </el-dialog>




  </div>
</template>

<script lang="ts">
  import {
    Component,
    Vue,
    Watch
  } from 'vue-property-decorator';
  import UploadComponents from "@/components/comm/UploadComponents.vue";
  import  {getCouponLists,opRightsCard,getRightsCard} from '@/common/fetch'
  import {findArrayIdx, plainArray, createTmplArray, objTranslate} from '@/common/utils';
  @Component({
    mixins:[],
    components: {
      UploadComponents
    }
  })

  export default class RightCardDetail extends Vue {


    saveActive(){
        if(!this.card_name){
          this.$notify.error({
            title: '错误',
            message: '请填写名称'
          })
          return
        }
        if(!this.price){
          this.$notify.error({
            title: '错误',
            message: '请填写价格'
          })
          return
        }
      if(!this.card_content.score){
        this.$notify.error({
          title: '错误',
          message: '请填写礼包积分'
        })
        return
      }
      let id = this.$route.query.id;

      let arr=this.card_content
        arr.coupon=this.selectValue.join(',')
        let data={
          card_name:this.card_name,
          bg_img:this.bg_img,
          price:this.price,
          card_content:JSON.stringify(arr),
          descr:this.descr
        }
        let that=this

        if(id){
          data.card_id=id
        }
        opRightsCard(data).then(res=>{
          this.$message({
            message:res.msg,
            type: 'success'
          })
          setTimeout(function () {
            that.$router.push({
              name: 'RightCard'
            })
          },1000)
        }).catch(e=>{

        })

    }

    card_content={
      score:'',
      coupon:''
    }
    price=''
    card_name=''
    bg_img=''
    upThumbSuccessCall(url_list){
      if(url_list.length>0){
        this.bg_img=url_list[0].url
        return
      }
      this.bg_img=''
    }



    status=true
    value2=''
    first=''
    after=''
    top_free=''
    miss_free1=[]
    miss_free2=[]
    miss_free3=[]
    descr=''

    isShow=false

    del(idx){
      this.selectValue=[]
      this.productData.splice(idx,1)
      this.productData.map(item=>{
        this.selectValue.push(item.Coupon_ID)
      })
      // setTimeout(()=>{
      //   this.$refs.funTableComp.hasCreated()
      // },50)
    }
    openCoupon(){
      this.isShow=true;
      this.selectValue=[]
      this.productData.map(item=>{
        this.selectValue.push(item.Coupon_ID)
      })

    }
    closeDialog(){
      this.isShow=false
    }
    dataTableOpt = {
      act : '',
      dataList:[],
      page:1,
      totalCount:100,
      pageSize:10,
      is_paginate:true,//是否显示分页 默认显示
      columns : [
        {
          prop: "Coupon_ID",
          label: "优惠券ID",
          align:'center',
          search: false //不需要搜索ID,所以都不需要了

        },{
          prop: "Coupon_Subject",
          label: "优惠券名称",
          align:'center',
          search: false //不需要搜索ID,所以都不需要了

        }
      ]
    }

    selectValue=[]
    productData=[]
    //获取选中数据
    selectVal(val,vals){
      this.selectValue=[]
      this.productData=[]

      for(let item of val){
        this.productData.push(item)
        if(this.selectValue.indexOf(item.Coupon_ID)==-1){
          this.selectValue.push(item.Coupon_ID)
          //this.productData.push(item)
        }
      }
      for(let it of  vals){
        for(let i=0;i<this.selectValue.length;i++){
          if(this.selectValue[i]==it.Coupon_ID){
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
      let data={
        pageSize: this.dataTableOpt.pageSize,
        page:this.dataTableOpt.page,
        User_ID:'',
        front_show: 2,
        status:1
      }

      getCouponLists(data).then(res=>{
        if(res.errorCode==0){
          this.dataTableOpt.dataList=res.data
          this.dataTableOpt.totalCount=res.totalCount
        }
      })
    }


    init(){
      let id = this.$route.query.id;

      getRightsCard({card_id:id}).then(res=>{
         let arr= res.data[0]
          this.card_name=arr.card_name
        this.price=arr.price
        this.descr=arr.descr
        this.card_content.score=arr.card_content.score
        let cou=arr.card_content.coupon.split(',')
        this.selectValue=cou

        //@ts-ignore
        this.bg_img = arr.bg_img
        //组件里面初始化
        if(this.bg_img){
          //@ts-ignore
          this.$refs.thumb.handleInitHas([this.bg_img])
        }


        for(let item of this.dataTableOpt.dataList){
          for(let it of this.selectValue){
            if(it==item.Coupon_ID){
              this.productData.push(item)
            }
          }
        }

      })

    }

    created(){
      this.getProduct()
      let id = this.$route.query.id;
      if(id){
        this.init()
      }

    }


  }

</script>
<style scoped lang="less">
  .submit-div{
    width: 100%;
    height: 60px;
    background:rgba(255,255,255,1);
    box-shadow:0px 3px 12px 0px rgba(0, 0, 0, 0.2);
    position: fixed;
    left: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .submit{
    width:72px;
    height:37px;
    line-height: 37px;
    text-align: center;
    background:rgba(66,140,247,1);
    border-radius:5px;
    font-size: 14px;
    color: #FFFFFF;
  }
  .tui-btn{
    cursor: pointer;
    width: 60px;
    height: 25px;
    line-height: 25px;
    text-align: center;
    font-size: 12px;
    color: #FFFFFF;
    background-color: #428CF7;
    margin-left: 48px;
  }
  .disableds{
    background-color: #D3D3D3 !important;
  }
  .del-img{
    position: absolute;
    top: -6px;
    right: -6px;
  }
  .coupons{
    margin-top: 10px;
    padding: 0px 13px;
    background-color: #F8F8F8;
    position: relative;
    width: fit-content;
    height: 30px;
    line-height: 30px;
    box-sizing: border-box;
    display: inline-block;
    margin-right: 20px;
  }
  .give-div{
    width: 566px;
    padding: 4px 20px 24px 20px;
    background-color: #F9F9F9;
    font-size: 12px;
    color: #888888;
  }
  .active{
    background-color: #428CF7 !important;
  }
  .imgs{
    width: 30px;
    height: 30px;
    margin-right: 14px;
  }
  .give-div-item{
    height: 54px;
    border-bottom:1px dotted rgba(219,219,219,1);
  }

  .free-all{
    background-color: #F8F8F8;
    padding: 20px 0px 0px 20px;
    box-sizing: border-box;
  }
  .free-content{
    width: 100%;
    height: 100%;
    background-color: #FFFFFF;
    padding: 30px;
    box-sizing: border-box;
  }
  .free-top{
    width: 734px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #F8F8F8;
    padding: 0px 24px;
    font-size: 14px;
    color: #666666;
    margin-bottom: 20px;
  }
  .inputs{
    width: 120px;
    height: 40px;
    margin-left: 14px;
    margin-right: 10px;
  }
  .flex {
    display: flex;
  }
  .flex-align-c{
    align-items: center;
  }

  .c8{
    color: #888888;
  }
  .c6{
    color: #666666;
  }
  .select{
    font-size: 14px;
    color: #428CF7;
    cursor: pointer;
    margin-left: 22px;
  }


</style>
