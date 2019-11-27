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
          <span class="spans">选择优惠券</span>
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
    import  {getCrowds,addBatch} from '@/common/fetch'
    @Component({
        mixins:[],
        components: {

        }
    })

    export default class AddProduct extends Vue {

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
        //刷新
        refresh(){
            let id = this.$route.params.id
            if(this.loading)return
            this.loading=true
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
                    this.loading=false
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
</style>
