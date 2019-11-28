<template>
  <div class="labelManagement">
    <div class="labelMain">
      <el-form size="small">
        <el-form-item  label="赠送对象："  >
            <el-select  placeholder="请选择"  v-model="crowdId" style="width: 200px">
              <template v-for="(shop,shopIn) in crowdList">
                <el-option :label="shop.name" :value="shop.id"></el-option>
              </template>
            </el-select>
          <span class="spans" style="margin-left: 20px" @click="refresh">刷新</span><span class="spans"> | </span><span class="spans" @click="cancelPro">人群管理</span>
        </el-form-item>

        <el-form-item  label="赠送优惠券："  >
          <span class="spans" @click="selectGi">选择优惠券</span>
          <el-tooltip :content="text"  placement="top" effect="light">
            <div style="display:inline-block">
              <div  class="lst" style="display: block" v-if="text">{{text}}</div>
            </div>
          </el-tooltip>
        </el-form-item>


        <el-form-item label="发送时间：" class="flex">
          <el-radio-group  v-model="times">
            <el-radio label="0" class="radioTop">
              立即发送
            </el-radio>
            <el-radio label="1" class="radioBottom">
              定时发送
              <el-date-picker
                v-model="send_time"
                class="dateTime"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期时间">
              </el-date-picker>
            </el-radio>
          </el-radio-group>
        </el-form-item>

        <div class="all">
          <el-button style="margin-left: 60px" @click="cancelPro" >取消</el-button>
          <el-button :loading="loading" style="margin-left: 100px"  type="primary" @click="saveData">保存</el-button>
        </div>
      </el-form>
    </div>

    <el-dialog
      title="选择优惠券"
      width="60%"
      @close="cardCancel"
      append-to-body
      :visible.sync="isShow"
      class="setting"
    >
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
          label="优惠券ID"
          prop="id"
          width="120">
        </el-table-column>
        <el-table-column
          prop="title"
          label="优惠券"
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
    import  {getCrowds,addBatch,getGivingCoupons} from '@/common/fetch'
    @Component({
        mixins:[],
        components: {

        }
    })

    export default class AddProduct extends Vue {
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
        searchList(){
            let data={
                page:this.page,
                pageSize:this.pageSize
            }
             getGivingCoupons(data).then(res=>{
                if(res.errorCode==0){
                    this.GivingGifts=res.data;
                }
            })
        }
        //取消
        cardCancel(){
            this.isShow=false
        }
        selectGi(){
            this.isShow=true;
        }
        handleSelectionChange(val){
            if(val){
                this.isShow=false
                this.text=val.title
                this.send_id=val.id
                this.$refs.multipleTable.setCurrentRow();
            }
        }
        //赠品结束



        crowdList=[]
        crowdId=''
        loading=false
        send_time=''
        times="0"
        cancelPro(){
            this.$router.push({
                name:'CrowdClient'
            })
        }
        saveData(){
            //保存
            if(this.loading)return
            this.loading=true
            let data={
                type:4,
                send_name:this.text,
                send_id:this.send_id,
                crowd_id:this.crowdId
            }
            if(this.times==0){
                data.send_time=0
            }else if(this.times==1){
                data.send_time=this.send_time
            }
            addBatch(data).then(res=>{
                if(res.errorCode==0){
                    this.$message({
                        type: 'success',
                        message: res.msg
                    });
                    let that=this
                    setTimeout(function () {
                        that.$router.push({
                            name:'CrowdClient'
                        })
                    },1000)
                }
            }).catch(e=>{
                this.loading=false
            })
        }
        //刷新
        refresh(){
            let id = this.$route.params.id
            getCrowds({page:1,pageSize:10000}).then(res=>{
                if(res.errorCode==0){
                    this.$message({
                        type: 'success',
                        message: '刷新成功'
                    });
                    this.crowdList=res.data
                    if(id){
                        this.crowdId=id
                    }
                }
            })
        }

        async created(){
            let id = this.$route.params.id
            //获取人群列表
            getCrowds({page:1,pageSize:10000}).then(res=>{
                if(res.errorCode==0){
                    this.crowdList=res.data
                    if(id){
                        this.crowdId=id
                    }
                }
            })

            let data={
                page:this.page,
                pageSize:this.pageSize
            }
            //赠品
            await getGivingCoupons(data).then(res=>{
                if(res.errorCode==0){
                    this.GivingGifts=res.data;
                    this.totalCount=res.totalCount
                }
            })

        }




    }

</script>

<style scoped lang="less">
  @bgColor:#428CF7;
  .labelManagement{
    background-color: #f6f6f6;
    padding-top: 18px;
    padding-left: 19px;
    width: 100%;
    box-sizing: border-box;
    .labelMain{
      background-color: #FFFFFF;
      width: 100%;
      box-sizing: border-box;
      padding-top: 30px;
      padding-left: 24px;
    }
  }
  .spanButton{
    width:75px;
    height:40px;
    line-height: 40px;
    text-align: center;
    cursor: pointer;
    border-radius:5px;
    margin-top: 50px;
    display: inline-block;
    font-size: 16px;
    background-color: #428CF7;
    color: #FFFFFF;
    margin-left: 20px;
  }
  .spanButton.cancel{
    background-color: #E7E7E7;
    color: #666666;
    margin-left: 45px;
  }
  .spans{
    color: #428CF7;
    font-size: 14px;
    cursor: pointer;
  }

  .radioTop{
    display: block;
    margin-bottom: 15px;
    padding-top: 8px
  }
  .radioBottom{
    display: block;
    margin-bottom: 15px;
  }
  .flex{
    display: flex;
  }
  .dateTime{
    margin-left: 18px;
    width: 170px;
    padding-right: 0px
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

</style>
