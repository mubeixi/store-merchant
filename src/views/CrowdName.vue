<template>
  <div class="labelManagement">
    <div class="labelMain">
          <div class="crowdName">
            人群名称
          </div>
          <el-input size="small" class="inputs" placeholder="请输入人群名称"></el-input>
          <div class="crowdName" style="margin-bottom: 22px;">
            行为关系
          </div>
      <el-form size="small">
          <el-form-item>
              <el-checkbox label="lastTime" name="consumptionTimes">
                最近有消费
                <el-input  class="marginLR" style="width: 70px;margin-left: 26px;margin-right: 8px;"></el-input><span style="color: #B3B3B3">天内</span>
              </el-checkbox>
          </el-form-item>
          <el-form-item>
            <el-checkbox label="lastTime" name="consumptionTimes">
              最近无消费
              <el-input  class="marginLR" style="width: 70px;margin-left: 26px;margin-right: 8px;"></el-input><span style="color: #B3B3B3">天内</span>
            </el-checkbox>
          </el-form-item>
          <el-form-item>
            <el-checkbox label="lastTime" name="consumptionTimes">
              最近有下单
              <el-input  class="marginLR" style="width: 70px;margin-left: 26px;margin-right: 8px;"></el-input><span style="color: #B3B3B3">天内</span>
            </el-checkbox>
          </el-form-item>

        <el-form-item>
        <el-checkbox label="lastTime" name="consumptionTimes">
          最近消费次数
          <el-input  class="marginLR" ></el-input><span style="color: #B3B3B3">次</span>
          <span style="margin-left: 10px">一</span>
          <el-input  class="marginLR"  ></el-input><span style="color: #B3B3B3">次</span>
        </el-checkbox>
      </el-form-item>

        <el-form-item>
          <el-checkbox label="lastTime" name="consumptionTimes">
            最近消费金额
            <el-input  class="marginLR" ></el-input><span style="color: #B3B3B3">元</span>
            <span style="margin-left: 10px">一</span>
            <el-input  class="marginLR"  ></el-input><span style="color: #B3B3B3">元</span>
          </el-checkbox>
        </el-form-item>

        <el-form-item>
          <el-checkbox label="lastTime" name="consumptionTimes">
            累计获得积分
            <el-input  class="marginLR" ></el-input><span style="color: #B3B3B3">分</span>
            <span style="margin-left: 10px">一</span>
            <el-input  class="marginLR"  ></el-input><span style="color: #B3B3B3">分</span>
          </el-checkbox>
        </el-form-item>


        <el-form-item>
          <el-checkbox label="lastTime" name="consumptionTimes">
            订单均价
            <el-input  class="marginLR" ></el-input><span style="color: #B3B3B3">元</span>
            <span style="margin-left: 10px">一</span>
            <el-input  class="marginLR"  ></el-input><span style="color: #B3B3B3">元</span>
          </el-checkbox>
        </el-form-item>

        <el-form-item>
          <el-checkbox label="lastTime" name="consumptionTimes">
            会员等级
            <el-select class="marginLR"    style="width:90px">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-checkbox>
        </el-form-item>

        <el-form-item>
          <el-checkbox label="lastTime" name="consumptionTimes">
            关注公众号时间
            <el-input  class="marginLR" style="width: 70px;margin-left: 26px;margin-right: 8px;"></el-input><span style="color: #B3B3B3">天内</span>
          </el-checkbox>
        </el-form-item>

        <el-form-item>
          <el-checkbox label="lastTime" name="consumptionTimes">
            最近有访问
            <el-input  class="marginLR" style="width: 70px;margin-left: 26px;margin-right: 8px;"></el-input><span style="color: #B3B3B3">天内</span>
          </el-checkbox>
        </el-form-item>

        <el-form-item>
          <el-checkbox label="lastTime" name="consumptionTimes">
            最近无访问
            <el-input  class="marginLR" style="width: 70px;margin-left: 26px;margin-right: 8px;"></el-input><span style="color: #B3B3B3">天内</span>
          </el-checkbox>
        </el-form-item>

        <el-form-item>
          <el-checkbox label="lastTime" name="consumptionTimes">
            退款订单数
            <el-input  class="marginLR" ></el-input><span style="color: #B3B3B3">笔</span>
            <span style="margin-left: 10px">一</span>
            <el-input  class="marginLR"  ></el-input><span style="color: #B3B3B3">笔</span>
          </el-checkbox>
        </el-form-item>

        <el-form-item>
          <el-checkbox label="lastTime" name="consumptionTimes">
            无退款订单数
            <el-input  class="marginLR" ></el-input><span style="color: #B3B3B3">笔</span>
            <span style="margin-left: 10px">一</span>
            <el-input  class="marginLR"  ></el-input><span style="color: #B3B3B3">笔</span>
          </el-checkbox>
        </el-form-item>

        <el-form-item>
          <el-checkbox label="lastTime" name="consumptionTimes">
            客户标签
            <el-select class="marginLR"    style="width:90px">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-checkbox>
        </el-form-item>

      </el-form>

      <div class="submit">保存</div>
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
    margin-left: 10%;
  }
</style>
