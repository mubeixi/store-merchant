<template>
  <div class="RotateAll">
    <el-form size="small">
      <div class="rotateName line15">
        <el-form-item label="活动名称：" prop="name">
          <el-input v-model="title" style="width: 350px"></el-input>
        </el-form-item>
      </div>

      <div class="rotateName line15">
        <el-form-item label="活动时间：" prop="name">
          <el-date-picker
            v-model="dateValue"
            type="datetimerange"
            align="right"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['12:00:00']">
          </el-date-picker>
        </el-form-item>
      </div>

      <div class="rotateName line15 " style="padding-left: 24px">
        <el-form-item label="每人参与总次数：" prop="name">
          <el-input v-model="total_count" style="width: 75px"></el-input>
          <span class="paddingL10">次</span>
        </el-form-item>
      </div>
      <div class="rotateName line15 paddingL10"  >
        <el-form-item label="每人每天参与总次数：" prop="name">
          <el-input v-model="day_count" style="width: 75px"></el-input>
          <span class="paddingL10">次</span>
        </el-form-item>
      </div>

      <div class="rotateLast line10">
          <div class="rotateList">
              <div class="rotateDiv">
                <el-form-item label="奖品设置：" prop="name">
                  <el-select v-model="tyep" placeholder="请选择奖品" style="width: 130px">
                    <el-option label="赠品" value="shanghai"></el-option>
                    <el-option label="优惠券" value="beijing"></el-option>
                    <el-option label="积分" value="hah"></el-option>
                  </el-select>
                  <block>
<!--                    <el-input placeholder="请输入积分数量" style="width: 130px;margin-left: 15px"></el-input>-->
                  </block>
                  <block>
                    <span class="spans"  @click="selectGi">选择赠品</span>
                  </block>
                  <block>
                    <span class="spans" >选择优惠券</span>
                  </block>
                </el-form-item>
<!--                <div class="first second" >-->
<!--                  <div class="listLine" v-for="(item,index) of productData">-->
<!--                    <img :src="item.img_url||item.ImgPath" class="lineImg">-->
<!--                    <div class="lineDiv">{{item.Products_Name}}</div>-->
<!--                  </div>-->
<!--                </div>-->

<!--                <div class="first second" >-->
<!--                  <div class="listLine" style="height: 37px" v-for="(item,index) of productDatas">-->
<!--                    <div class="lineDiv" style="margin-left: 0px">{{item.title}}</div>-->
<!--                  </div>-->
<!--                </div>-->
                <el-form-item label="奖品数量：" prop="name">
                  <el-input v-model="name" style="width: 75px"></el-input>
                  <span class="paddingL10">个</span>
                </el-form-item>
                <el-form-item label="奖品概率：" prop="name">
                  <el-input v-model="name" style="width: 75px"></el-input>
                  <span class="paddingL10">%</span>
                </el-form-item>
              </div>
              <div class="rotateImg">
<!--                <img class="imgWidth" src="@/assets/img/rotateAdd.png">-->
                <img class="imgWidth" src="@/assets/img/rotateDel.png">
              </div>
          </div>

      </div>

      <div class="rotateRule">
        <el-form-item label="活动规则：" prop="name">
          <el-input v-model="name" style="width: 500px" type="textarea"  :autosize="{ minRows: 3, maxRows: 10}" resize="none"></el-input>
        </el-form-item>
      </div>

      <div class="myButton">
        <el-button >返回</el-button>
        <el-button type="primary" style="margin-left: 20px">保存</el-button>
      </div>
    </el-form>


    <el-dialog
      title="选择赠品"
      width="60%"

      @close="cardCancel"
      append-to-body
      :visible.sync="isShow"
      class="setting"
    >
      <div class="cardTitle" style="margin-bottom: 10px">
        <div class="cardTitle" style="margin-right: 10px">
          产品名称： <el-input    class="sortInput" style="width: 100px" v-model="nameMbx"></el-input>
        </div>
        <el-button  type="primary" @click="searchList">搜索</el-button>
      </div>
      <el-table
        ref="multipleTable"
        :data="GivingGifts"
        tooltip-effect="dark"
        style="width: 100%"
        highlight-current-row
        @current-change="handleSelectionChange"
      >
        <el-table-column
          type="index"
          label="#"
          width="55">
        </el-table-column>
        <el-table-column
          label="赠品名称"
          prop="gift_name"
          width="120">
        </el-table-column>
        <el-table-column
          prop="Products_Name"
          label="产品名称"
          width="300px"
        >
          <template slot-scope="scope">
            <div class="fixDisplay">
              <div style="width: 100px;height: 100px">
                <img :src="GivingGifts[scope.$index].img_url" style="width: 100%;height: 100%">
              </div>
              <div style="width: 200px;margin-left: 10px;">{{GivingGifts[scope.$index].Products_Name}}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="Products_Count"
          label="剩余库存"
          show-overflow-tooltip>
        </el-table-column>
      </el-table>
      <el-pagination
        style="margin-top: 20px;text-align: center;"
        @current-change="currentChange"
        background
        :page-size="pageSize"
        layout="prev, pager, next"
        :total="totalCount">
      </el-pagination>
    </el-dialog>





  </div>
</template>

<script lang="ts">
    import {
        Component,
        Vue,
        Watch
    } from 'vue-property-decorator';
    import {
        Action,
        State
    } from 'vuex-class'
    import fa from "element-ui/src/locale/lang/fa";
    import {
        getGivingGifts,getGivingCoupons
    } from '@/common/fetch';
    import {findArrayIdx, plainArray, createTmplArray, objTranslate} from '@/common/utils';
    @Component({
        mixins:[],
        components: {

        }
    })

    export default class Rotate extends Vue {
        //静态页面使用
        title=''
        total_count=''
        day_count=''
        dateValue=''

        //赠品操作
        isShow=false
        nameMbx='';
        GivingGifts=[]
        text=''
        send_id=''
        totalCount=0
        page=1
        pageSize=8
        currentChange(val){
            this.page=val;
            this.searchList()
        }
        //取消
        cardCancel(){
            this.isShow=false
        }
        selectGi(){
            this.searchList();
            this.isShow=true;
        }
        searchList(){
            let data={
                page:this.page,
                pageSize:this.pageSize,
                pro_name:this.nameMbx
            }
            getGivingGifts(data).then(res=>{
                if(res.errorCode==0){
                    this.GivingGifts=res.data;
                }
            })
        }
        handleSelectionChange(val){
            if(val){
                console.log(val.Products_Name,"sss")
                this.isShow=false
                this.text=val.Products_Name
                this.send_id=val.id
                //this.direct_buy.value.gift_id=val.id
                this.$refs.multipleTable.setCurrentRow();
            }
        }
        //赠品结束


    }

</script>

<style scoped lang="less">

  .RotateAll{
    width: 100%;
    padding: 20px 24px 64px 44px;
    box-sizing: border-box;
    background-color: #ffffff;
  }

  .rotateName{
    width: 100%;
    height: 65px;
    line-height: 65px;
    background-color: #F8F8F8;
    padding-top: 16px;
    box-sizing: border-box;
    padding-left: 66px;
  }
  .paddingL10{
    padding-left: 10px !important;
  }

  .rotateLast{
    width: 100%;
    padding: 15px 0px 38px 30px;
    background-color: #F8F8F8;
    box-sizing: border-box;
  }

  .rotateList{
    width: 100%;
    display: flex;
    .rotateDiv{
      width: 450px;
      background-color: #fff;
      margin-right: 25px;
      padding: 15px 33px 15px 20px;
      box-sizing: border-box;
    }
  }
  .rotateImg{
    width: 30px;
    height: 30px;
    cursor: pointer;
    .imgWidth{width: 100%;height: 100%}
  }
  .spans{
    color: #428CF7;
    cursor: pointer;
    margin-left: 17px;
    font-size: 12px;
  }

  .second{
    width: 100%;
    padding: 5px 22px 12px 0px !important;
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

  .rotateRule{
    width: 100%;
    padding: 15px 0px 28px 66px;
    background-color: #F8F8F8;
    box-sizing: border-box;
  }

  .myButton{
    margin-top: 44px;
    margin-left: 275px;
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
