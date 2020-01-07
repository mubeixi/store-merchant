<template>
  <div class="RotateAll">
    <el-form size="small">
      <div class="rotateName line15">
        <el-form-item label="活动名称：" >
          <el-input v-model="title" style="width: 350px" :disabled="!editCan"></el-input>
        </el-form-item>
      </div>

      <div class="rotateName line15">
        <el-form-item label="活动时间：" >
          <el-date-picker
            :disabled="!editCan"
            v-model="dateValue"
            type="datetimerange"
            align="right"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['12:00:00']">
          </el-date-picker>
          <span style="color: red;margin-left: 10px">(先选择时间区间，再选取时间点)</span>
        </el-form-item>
      </div>

      <div class="rotateName line15 " style="padding-left: 24px">
        <el-form-item label="每人参与总次数：" >
          <el-input :disabled="!editCan" v-model="total_count" style="width: 75px"></el-input>
          <span class="paddingL10">次</span>
        </el-form-item>
      </div>
      <div class="rotateName line15 paddingL10"  >
        <el-form-item label="每人每天参与总次数：">
          <el-input :disabled="!editCan" v-model="day_count" style="width: 75px"></el-input>
          <span class="paddingL10">次</span>
        </el-form-item>
      </div>

      <div class="rotateLast line10">
          <div class="rotateList line10" v-for="(item,index) of rotateList" :key="index">
              <div class="rotateDiv" >
                <el-form-item label="奖品设置：" >
                  <el-select :disabled="!editCan" v-model="item.type" placeholder="请选择奖品" @change="changeSelect(index)" style="width: 130px">
                    <el-option label="赠品" value="gift"></el-option>
                    <el-option label="优惠券" value="coupon"></el-option>
                    <el-option label="积分" value="score"></el-option>
                  </el-select>
                  <block v-if="item.type==='score'">
                    <el-input :disabled="!editCan" placeholder="请输入积分数量" v-model="item.value" style="width: 130px;margin-left: 15px"></el-input>
                  </block>
                  <block v-if="item.type==='gift'">
                    <span class="spans"  @click="selectGi(index)">选择赠品</span>
                  </block>
                  <block v-if="item.type==='coupon'">
                    <span class="spans" @click="selectGis(index)">选择优惠券</span>
                  </block>
                </el-form-item>
                <div class="first second" v-if="item.type==='gift'">
                  <div class="listLine" v-if="item.pname||item.lose_txt">
                    <img :src="item.img_url" class="lineImg">
                    <div class="lineDiv" v-if="item.pname">{{item.pname}}</div>
                    <div class="lineDiv" style="color: red" v-else>{{item.lose_txt}}</div>
                  </div>
                </div>

                <div class="first second"  v-if="item.type==='coupon'">
                  <div class="listLine" style="height: 37px" v-if="item.cname||item.lose_txt">
                    <div class="lineDiv" style="margin-left: 0px" v-if="item.cname">{{item.cname}}</div>
                    <div class="lineDiv" style="margin-left: 0px;color: red" v-else>{{item.lose_txt}}</div>
                  </div>
                </div>
                <el-form-item label="奖品数量："    >
                  <el-input :disabled="!editCan" v-model="item.count" style="width: 75px" type="number"></el-input>
                  <span class="paddingL10">个</span>
                </el-form-item>
                <el-form-item label="奖品概率：" >
                  <el-input :disabled="!editCan" v-model="item.rate" style="width: 75px"></el-input>
                  <span class="paddingL10">%</span>
                </el-form-item>
              </div>
              <div class="rotateImg">
                <img class="imgWidth" src="@/assets/img/rotateAdd.png" @click="addList"  v-if="index==0">
                <img class="imgWidth" src="@/assets/img/rotateDel.png" @click="delList(index)" v-else>
              </div>
          </div>

      </div>

      <div class="rotateRule">
        <el-form-item label="活动规则：" >
          <el-input :disabled="!editCan" v-model="describe" style="width: 500px" type="textarea"  :autosize="{ minRows: 5, maxRows: 10}" resize="none"></el-input>
        </el-form-item>
      </div>

      <div class="bottomFixed">
        <el-button size="small" type="primary" :loading="isLoadng" :disabled="!editCan" @click="saveTurn">保存提交</el-button>
        <el-button size="small" @click="goBack">返回</el-button>
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
          >
        </el-table-column>
        <el-table-column
          label="赠品名称"
          prop="gift_name"
          >
        </el-table-column>
        <el-table-column
          prop="Products_Name"
          label="产品名称" width="300px"
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


    <el-dialog
      title="选择优惠券"
      width="40%"
      @close="cardCancels"
      append-to-body
      :visible.sync="isShows"
      class="setting"
    >
      <div class="cardTitle" style="margin-bottom: 10px">
        <div class="cardTitle" style="margin-right: 10px">
          优惠券名称： <el-input    class="sortInput" style="width: 100px" v-model="nameMbxs"></el-input>
        </div>
        <el-button  type="primary" @click="searchLists">搜索</el-button>
      </div>
      <el-table
        ref="multipleTables"
        :data="GivingGiftss"
        tooltip-effect="dark"
        style="width: 100%"
        highlight-current-row
        @current-change="handleSelectionChanges"
      >
        <el-table-column
          type="index"
          label="#"
        >
        </el-table-column>
        <el-table-column
          label="优惠券ID"
          prop="id"
        >
        </el-table-column>
        <el-table-column
          prop="title"
          label="优惠券名称"
          >
        </el-table-column>
      </el-table>
      <el-pagination
        style="margin-top: 20px;text-align: center;"
        @current-change="currentChanges"
        background
        :page-size="pageSizes"
        layout="prev, pager, next"
        :total="totalCounts">
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
        getGivingGifts,getGivingCoupons,addTurn,getTurn
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
        dateValue=[]
        describe='1、抽中积分，将直接赠送到您的积分账户，可在个人中心>积分中查看。\n' +
            '2、抽中赠品，请点击个人中心>赠品中心进行领取\n' +
            '3、抽中优惠券，将直接赠送到您的优惠券账户，可在个人中心>优惠券查看，也可直接购买商品抵扣'//活动描述

        rotateList=[{
            type:'score',
            value:'',
            count:'',
            rate:''
        }]
        rotateIndex=0 //当前点击的是

        changeSelect(index){
            for(let it in this.rotateList[index]){
                if(it=='type') continue
                this.rotateList[index][it]=''

            }
        }

        //赠品操作
        isShow=false
        nameMbx='';
        GivingGifts=[]
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
        selectGi(index){
            if(!this.editCan)return
            this.rotateIndex=index
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
                this.isShow=false
                console.log(val)
                this.rotateList[this.rotateIndex].img_url=val.img_url
                this.rotateList[this.rotateIndex].pname=val.Products_Name
                this.rotateList[this.rotateIndex].value=val.id
                this.$refs.multipleTable.setCurrentRow();
            }
        }
        //赠品结束
        //优惠券操作
        isShows=false
        nameMbxs='';
        GivingGiftss=[]
        totalCounts=0
        pages=1
        pageSizes=8
        currentChanges(val){
            this.pages=val;
            this.searchLists()
        }
        //取消
        cardCancels(){
            this.isShows=false
        }
        selectGis(index){
            if(!this.editCan)return
            this.rotateIndex=index
            this.searchLists();
            this.isShows=true;
        }
        searchLists(){
            let data={
                page:this.pages,
                pageSize:this.pageSizes,
                cou_name:this.nameMbxs
            }
            getGivingCoupons(data).then(res=>{
                if(res.errorCode==0){
                    this.GivingGiftss=res.data;
                }
            })
        }
        handleSelectionChanges(val){
            if(val){
                this.isShows=false
                this.rotateList[this.rotateIndex].cname=val.title
                this.rotateList[this.rotateIndex].value=val.id
                this.$refs.multipleTables.setCurrentRow();
            }
        }
        //优惠券结束


        addList(){
            if(!this.editCan)return

            if(this.rotateList.length<8){
                this.rotateList.push({
                    type:'score',
                    value:'',
                    count:'',
                    rate:''
                })
            }else{
                this.$message({
                    message: '最多设置8个活动',
                    type: 'warning'
                });
            }
        }
        delList(index){
            if(!this.editCan)return
            this.rotateList.splice(index,1)
        }

        isLoadng=false
        saveTurn(){
            this.isLoadng=true

            let info={
                title:this.title,
                describe:this.describe,
                total_count:this.total_count,
                day_count:this.day_count,
                prize_rule:JSON.stringify(this.rotateList)
            }
            if(this.dateValue.length==2){
                    info.start_time=this.dateValue[0]
                    info.end_time=this.dateValue[1]
            }
            let id =this.$route.query.id
            if(id){
                info.id=id
            }
            let that=this
            addTurn(info).then(res=>{
                if(res.errorCode==0){
                    this.$message({
                        message:res.msg,
                        type: 'success'
                    })
                    setTimeout(function () {
                        that.$router.push({
                            name: 'RotateList'
                        })
                    },1000)
                }

            }).catch(e=>{
                this.isLoadng=false
            })

        }

        goBack(){
            this.$router.push({
                name: 'RotateList'
            })
        }
        editCan=true

        created(){
            let id =this.$route.query.id
            if(id){
                getTurn({id:id}).then(res=>{
                    if(res.errorCode==0){
                        console.log(res,"ss")
                        this.day_count=res.data.day_count
                        this.total_count=res.data.total_count
                        this.title=res.data.title
                        this.dateValue.push(res.data.start_time)
                        this.dateValue.push(res.data.end_time)
                        this.rotateList=res.data.rules
                        this.describe=res.data.describe
                        this.editCan=res.data.status==0?true:false
                    }
                })
            }

        }

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
    padding: 15px 0px 28px 30px;
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
    padding: 15px 0px 15px 66px;
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
  .bottomFixed{
    position: fixed;
    padding: 10px 0;
    box-sizing: border-box;
    bottom: 0;
    width: 100%;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-align: center;
    align-items: center;
    -ms-flex-pack: center;
    justify-content: center;
    background-color: #fff;
    box-shadow: 0 -3px 5px #eee;
    z-index: 1;
    transition: right .2s ease;
  }
</style>
