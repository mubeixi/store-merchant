<template>
  <div class="labelManagement">
    <div class="labelMain">
          <div class="crowdName">
            人群名称
          </div>
          <el-input  v-model="nameCrowd" size="small" class="inputs" placeholder="请输入人群名称"></el-input>
          <div class="crowdName" style="margin-bottom: 22px;">
            行为关系
          </div>
      <el-form size="small">
          <el-form-item>
              <el-checkbox label="lastTime" name="consumptionTimes" v-model="crowdData.last_pay.checked">
                最近有消费
                <el-input  class="marginLR" v-model="crowdData.last_pay.value" style="width: 70px;margin-left: 26px;margin-right: 8px;"></el-input><span style="color: #B3B3B3">天内</span>
              </el-checkbox>
          </el-form-item>
          <el-form-item>
            <el-checkbox label="lastTime" name="consumptionTimes" v-model="crowdData.last_no_pay.checked">
              最近无消费
              <el-input  class="marginLR" style="width: 70px;margin-left: 26px;margin-right: 8px;" v-model="crowdData.last_no_pay.value"></el-input><span style="color: #B3B3B3">天内</span>
            </el-checkbox>
          </el-form-item>
          <el-form-item>
            <el-checkbox label="lastTime" name="consumptionTimes" v-model="crowdData.last_create_order.checked">
              最近有下单
              <el-input  class="marginLR" style="width: 70px;margin-left: 26px;margin-right: 8px;" v-model="crowdData.last_create_order.value"></el-input><span style="color: #B3B3B3">天内</span>
            </el-checkbox>
          </el-form-item>

        <el-form-item>
        <el-checkbox label="lastTime" name="consumptionTimes" v-model="crowdData.total_pay_times.checked">
          最近消费次数
          <el-input  class="marginLR" v-model="crowdData.total_pay_times.start"></el-input><span style="color: #B3B3B3" >次</span>
          <span style="margin-left: 10px">一</span>
          <el-input  class="marginLR" v-model="crowdData.total_pay_times.end"></el-input><span style="color: #B3B3B3" >次</span>
        </el-checkbox>
      </el-form-item>

        <el-form-item>
          <el-checkbox label="lastTime" name="consumptionTimes" v-model="crowdData.total_pay_money.checked">
            最近消费金额
            <el-input  class="marginLR"  v-model="crowdData.total_pay_money.start"></el-input><span style="color: #B3B3B3" >元</span>
            <span style="margin-left: 10px">一</span>
            <el-input  class="marginLR"   v-model="crowdData.total_pay_money.end"></el-input><span style="color: #B3B3B3">元</span>
          </el-checkbox>
        </el-form-item>

        <el-form-item>
          <el-checkbox label="lastTime" name="consumptionTimes" v-model="crowdData.total_get_integral.checked">
            累计获得积分
            <el-input  class="marginLR" v-model="crowdData.total_get_integral.start"></el-input><span style="color: #B3B3B3">分</span>
            <span style="margin-left: 10px">一</span>
            <el-input  class="marginLR"  v-model="crowdData.total_get_integral.end"></el-input><span style="color: #B3B3B3">分</span>
          </el-checkbox>
        </el-form-item>


        <el-form-item>
          <el-checkbox label="lastTime" name="consumptionTimes" v-model="crowdData.order_avg.checked">
            订单均价
            <el-input  class="marginLR" v-model="crowdData.order_avg.start"></el-input><span style="color: #B3B3B3">元</span>
            <span style="margin-left: 10px">一</span>
            <el-input  class="marginLR"  v-model="crowdData.order_avg.end"></el-input><span style="color: #B3B3B3">元</span>
          </el-checkbox>
        </el-form-item>

        <el-form-item>
          <el-checkbox label="lastTime" name="consumptionTimes" v-model="crowdData.user_level.checked">
            会员等级
          </el-checkbox>
          <el-select v-model="crowdData.user_level.value" multiple placeholder="请选择" style="margin-left: 10px;">
            <el-option
              v-for="item in levels"
              :label="item.level_name"
              :value="item.level">
            </el-option>
          </el-select>
        </el-form-item>


        <el-form-item>
          <el-checkbox label="lastTime" name="consumptionTimes"  v-model="crowdData.mp_follow.checked">
            关注公众号时间
            <el-input  class="marginLR" v-model="crowdData.mp_follow.value" style="width: 70px;margin-left: 26px;margin-right: 8px;"></el-input><span style="color: #B3B3B3">天内</span>
          </el-checkbox>
        </el-form-item>

        <el-form-item>
          <el-checkbox label="lastTime" name="consumptionTimes" v-model="crowdData.last_login.checked">
            最近有访问
            <el-input  class="marginLR" style="width: 70px;margin-left: 26px;margin-right: 8px;" v-model="crowdData.last_login.value"></el-input><span style="color: #B3B3B3">天内</span>
          </el-checkbox>
        </el-form-item>

        <el-form-item>
          <el-checkbox label="lastTime" name="consumptionTimes" v-model="crowdData.last_nologin.checked">
            最近无访问
            <el-input  class="marginLR" v-model="crowdData.last_nologin.value" style="width: 70px;margin-left: 26px;margin-right: 8px;"></el-input><span style="color: #B3B3B3">天内</span>
          </el-checkbox>
        </el-form-item>

        <el-form-item>
          <el-checkbox label="lastTime" name="consumptionTimes" v-model="crowdData.refund_order_num.checked">
            退款订单数
            <el-input  v-model="crowdData.refund_order_num.start"  class="marginLR" ></el-input><span style="color: #B3B3B3">笔</span>
            <span style="margin-left: 10px">一</span>
            <el-input  v-model="crowdData.refund_order_num.end"  class="marginLR"  ></el-input><span style="color: #B3B3B3">笔</span>
          </el-checkbox>
        </el-form-item>

        <el-form-item>
          <el-checkbox label="lastTime" name="consumptionTimes" v-model="crowdData.norefund_order_num.checked">
            无退款订单数
            <el-input v-model="crowdData.norefund_order_num.start"  class="marginLR" ></el-input><span style="color: #B3B3B3">笔</span>
            <span style="margin-left: 10px">一</span>
            <el-input v-model="crowdData.norefund_order_num.end"  class="marginLR"  ></el-input><span style="color: #B3B3B3">笔</span>
          </el-checkbox>
        </el-form-item>

        <el-form-item>
          <el-checkbox label="lastTime" name="consumptionTimes" v-model="crowdData.user_tag.checked">
            客户标签
          </el-checkbox>
          <el-select v-model="crowdData.user_tag.value" multiple placeholder="请选择" style="margin-left: 10px">
            <el-option
              v-for="item in tags"
              :label="item.tag_name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <div style="height: 80px;width: 100%;background-color: #ffffff"></div>
      </el-form>

      <div class="bottomFixed">
        <el-button size="small" :loading="loading"   type="primary" @click="saveData">保存提交</el-button>
        <el-button size="small"  @click="goCrowd" >返回</el-button>
      </div>
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

    import  {initCrowd,addCrowd,getCrowd} from  '@/common/fetch'


    @Component({
        mixins:[],
        components: {

        }
    })

    export default class AddProduct extends Vue {
        nameCrowd=''
        levels=[]
        loading=false
        tags=[]
        crowdData={
            last_pay:{value:'',checked:false},
            last_no_pay:{value:'',checked:false},
            last_create_order:{value:'',checked:false},
            total_pay_times:{start:'',end:'',checked:false},
            total_pay_money:{start:'',end:'',checked:false},
            total_get_integral:{start:'',end:'',checked:false},
            order_avg:{start:'',end:'',checked:false},
            user_level:{value:'',checked:false},
            mp_follow:{value:'',checked:false},
            last_login:{value:'',checked:false},
            last_nologin:{value:'',checked:false},
            refund_order_num:{start:'',end:'',checked:false},
            norefund_order_num:{start:'',end:'',checked:false},
            user_tag:{value:'',checked:false}
        }

        goCrowd(){
            this.$router.push({
                name: 'CrowdClient'
            })
        }

        saveData(){
            if(this.nameCrowd==''){
                this.$message({
                    message: '请填写人群名称',
                    type: 'error'
                })
                return
            }
            let id = this.$route.query.id
            if(this.loading) return;
            this.loading=true
            let data={
                name:this.nameCrowd,
                conditions:JSON.stringify(this.crowdData)
            }
            if(id){
                data.id=id
            }
            addCrowd(data).then(res=>{
                if(res.errorCode==0){
                    this.$message({
                        message: res.msg,
                        type: 'success'
                    })
                    setTimeout(()=>{
                        this.$router.push({
                            name: 'CrowdClient'
                        })
                    },1500)
                }
            }).catch(e=>{
                this.loading=false
            })

        }

        async created(){
            await initCrowd().then(res=>{
                if(res.errorCode==0){
                    this.levels=res.data.levels
                    this.tags=res.data.tags
                }
            })

            let id = this.$route.query.id
            if(!id) return
            await getCrowd({id:id}).then(res=>{
                if(res.errorCode==0){
                    this.nameCrowd=res.data.name
                    this.crowdData=res.data.conditions
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
      padding-bottom: 100px;
    }
  }

  .crowdName{
    font-size: 16px;
    color: #333333;
    height: 50px;
    line-height: 50px;
    padding-left: 20px;
    background-color: #F8F8F8;
    margin-right: 100px;
  }
.inputs{
  width: 280px;
  margin-top: 30px;
  margin-bottom: 30px;
}
  .marginLR{
    width: 70px;margin-left: 8px;margin-right: 8px;
  }
  .submit{
    width:92px;
    height:38px;
    background:rgba(66,140,247,1);
    font-size: 14px;
    color: #F3F3F3;
    text-align: center;
    line-height: 38px;
    margin-top: 42px;
    margin-left: 5%;
    display: inline-block;
  }
  .submits{
    display: inline-block;
    width:92px;
    height:38px;
    font-size: 14px;
    text-align: center;
    line-height: 38px;
    margin-top: 42px;
    margin-left: 40px;
    background-color: #FFFFFF;
    border: 1px solid #dcdfe6;
    color: #606266;
  }
.all{
  margin-top: 42px;
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
