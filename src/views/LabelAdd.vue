<template>
  <div class="labelManagement">
    <div class="labelMain">
      <el-form size="small">
        <el-form-item label="标签名称:">
          <el-input  style="width: 350px" :disabled="!isEdit"  v-model="allData.name"></el-input>
        </el-form-item>
        <el-form-item label="标签类型:">
          <el-radio-group v-model="allData.type">
            <el-radio label="1" >手动标签</el-radio>
            <el-radio label="2" >自动标签</el-radio>
          </el-radio-group>
        </el-form-item>
        <template v-if="allData.type==2">
          <div class="labelManual">
            <el-form-item label="满足条件:">
              <el-radio-group v-model="allData.rule_type">
                <el-radio label="0" >满足任意一个被选中的条件即可</el-radio>
                <el-radio label="1" >必须满足所有被选中的条件</el-radio>
              </el-radio-group>
            </el-form-item>
            <div class="conditionClass">
              <div style="font-size: 14px;color: #666666;margin-right: 16px;">
                交易条件:
              </div>
              <div>
                <el-checkbox-group v-model="allData.conditions.time.checked">
                  <el-checkbox label="lastTime" name="lastTime">最后消费时间</el-checkbox>
                </el-checkbox-group>

                <el-form-item label="最近:"  style="margin-left: 30px;margin-top: 25px;margin-bottom: 16px;">
                  <el-input  class="marginLR" v-model="allData.conditions.time.value"></el-input>天
                </el-form-item>

                <el-form-item>
                  <el-checkbox-group v-model="allData.conditions.count.checked">
                    <el-checkbox label="lastTime" name="consumptionTimes">
                      累计消费次数
                      <el-input  class="marginLR" style="width: 70px" v-model="allData.conditions.count.min"></el-input>次<span style="margin-left: 10px">一</span><el-input class="marginLR" v-model="allData.conditions.count.max"  style="width: 70px"></el-input>次
                    </el-checkbox>
                  </el-checkbox-group>
                </el-form-item>

                <el-form-item>
                  <el-checkbox-group v-model="allData.conditions.money.checked">
                    <el-checkbox label="lastTime" name="consumptionMoney">
                      累计消费金额
                      <el-input  class="marginLR" style="width: 70px" v-model="allData.conditions.money.min"></el-input>元<span style="margin-left: 10px">一</span><el-input class="marginLR" v-model="allData.conditions.money.max"  style="width: 70px"></el-input>元
                    </el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
              </div>

            </div>
          </div>
        </template>
        <el-button  class="submit"  :loading="loading" @click="saveData" type="primary">保存</el-button><el-button class="submits"  @click="goLabel">返回</el-button>
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
    import  {addTag,getTag} from '@/common/fetch'
    import fa from "element-ui/src/locale/lang/fa";

    @Component({
        mixins:[],
        components: {

        }
    })

    export default class AddProduct extends Vue {

        loading=false
        isEdit=true
        allData={
            name:"",
            rule_type:'0',
            type:'2',
            conditions:{
                time:{
                    checked:false,
                    value:''
                },
                count:{
                    min:'',
                    max:'',
                    checked: false
                },
                money:{
                    min:'',
                    max:'',
                    checked: false
                }
            }
        }

        saveData(){
            if(this.loading) return;
            this.loading=true
            // if(this.allData.name==''){
            //     this.$message({
            //         message: '请填写标签名称',
            //         type: 'error'
            //     })
            //     this.loading=false
            //     return
            // }
            let data={
                name:this.allData.name,
                type:this.allData.type,
                rule_type:this.allData.rule_type,
                conditions:JSON.stringify(this.allData.conditions)
            }
            let id = this.$route.params.id
            if(id){
                data.id=id;
            }
            addTag(data).then(res=>{
                    if(res.errorCode==0){
                        this.$message({
                            message: res.msg,
                            type: 'success'
                        })
                        this.loading=false
                        setTimeout(()=>{
                            this.$router.push({
                                name: 'LabelManagement'
                            })
                        },1500)
                    }
            }).catch(e=>{
                this.loading=false
            })

        }
        goLabel(){
            this.$router.push({
                name: 'LabelManagement'
            })
        }

        async created(){
            let id = this.$route.params.id
            if(id){
                this.isEdit=false
                getTag({id:id}).then(res=>{
                    if(res.errorCode==0){
                        this.allData.name=res.data.name
                        this.allData.type=String(res.data.type)
                        if(res.data.type!=1){
                            this.allData.rule_type=String(res.data.rule_type);
                            this.allData.conditions=res.data.conditions
                        }
                    }
                })
            }
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
  .labelManual{
    width: 80%;
    background-color: #F8F8F8;
    padding-top: 24px;
    padding-left: 84px;
    padding-bottom: 40px;
  }
  .conditionClass{
    margin: 28px 50px 0px 84px;
    background-color: #FFFFFF;
    padding-top: 20px;
    padding-left: 24px;
    display: flex;
  }
  .marginLR{
    width: 75px;
    margin-left: 9px;
    margin-right: 9px;
  }
.submit{
  margin-top: 42px;
  margin-left: 24%;

}
  .submits{
    margin-top: 42px;
    margin-left: 40px;
  }


</style>
