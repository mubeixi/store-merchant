<template>
  <div class="labelManagement">
    <div class="labelMain">
      <el-form>
        <el-form-item label="标签名称:">
          <el-input size="mini" style="width: 350px" ></el-input>
        </el-form-item>
        <el-form-item label="标签类型:">
          <el-radio-group v-model="LabelRadio">
            <el-radio label="0" >手动标签</el-radio>
            <el-radio label="1" >自动标签</el-radio>
          </el-radio-group>
        </el-form-item>
        <template v-if="LabelRadio==1">
          <div class="labelManual">
            <el-form-item label="满足条件:">
              <el-radio-group v-model="condition">
                <el-radio label="0" >满足任意一个被选中的条件即可</el-radio>
                <el-radio label="1" >必须满足所有被选中的条件</el-radio>
              </el-radio-group>
            </el-form-item>
            <div class="conditionClass">
              <div style="font-size: 14px;color: #666666;margin-right: 16px;">
                交易条件:
              </div>
              <div>
                <el-checkbox-group v-model="lastTime">
                  <el-checkbox label="lastTime" name="lastTime">最后消费时间</el-checkbox>
                </el-checkbox-group>

                <el-radio-group :disabled="!lastTime"  v-model="timeInterval" style="margin-left: 30px;margin-top: 25px;margin-bottom: 16px;">
                  <el-radio label="zuijin">最近
                    <el-input size="mini" class="marginLR"></el-input>天
                  </el-radio>
                  <el-radio label="zi">自定义
                    <el-form-item size="mini" style="display: inline-block">
                      <el-date-picker
                        type="datetime"
                        placeholder="选择开始时间"
                        align="right"
                        style="width: 140px"
                        :picker-options="pickerOptions">
                      </el-date-picker>
                      一
                      <el-date-picker
                        type="datetime"
                        style="width: 140px"
                        placeholder="选择结束时间"
                        :picker-options="pickerOptions">
                      </el-date-picker>
                    </el-form-item>
                  </el-radio>
                </el-radio-group>
                <el-form-item>
                  <el-checkbox-group v-model="consumptionTimes">
                    <el-checkbox label="lastTime" name="consumptionTimes">
                      累计消费金额
                      <el-input size="mini" class="marginLR" style="width: 70px"></el-input>元<span style="margin-left: 10px">一</span><el-input class="marginLR" size="mini" style="width: 70px"></el-input>元
                    </el-checkbox>
                  </el-checkbox-group>
                </el-form-item>

                <el-form-item>
                  <el-checkbox-group v-model="consumptionMoney">
                    <el-checkbox label="lastTime" name="consumptionMoney">
                      累计消费金额
                      <el-input size="mini" class="marginLR" style="width: 70px"></el-input>元<span style="margin-left: 10px">一</span><el-input class="marginLR" size="mini" style="width: 70px"></el-input>元
                    </el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
              </div>

            </div>
          </div>
        </template>
        <div class="submit">保存</div>
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

    @Component({
        mixins:[],
        components: {

        }
    })

    export default class AddProduct extends Vue {


        //手动标签和自动标签
        LabelRadio='1'

        //满足条件（&与|）
        condition='0'
        //是否选中最后消费时间
        lastTime=true

        //时间区域
        timeInterval="zuijin"

        //消费次数
        consumptionTimes=false
        //消费金额
        consumptionMoney=false

        async created(){

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
    width: 64%;
    background-color: #F8F8F8;
    padding-top: 24px;
    padding-left: 84px;
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
  width:92px;
  height:38px;
  background:rgba(66,140,247,1);
  font-size: 14px;
  color: #F3F3F3;
  text-align: center;
  line-height: 38px;
  margin-top: 42px;
  margin-left: 30%;
}

</style>
