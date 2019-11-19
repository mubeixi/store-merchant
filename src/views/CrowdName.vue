<template>
  <div class="labelManagement">
    <div class="labelMain">
          <div class="crowdName">
            人群名称
          </div>
          <el-input size="mini" class="inputs" placeholder="请输入人群名称"></el-input>
          <div class="crowdName" style="margin-bottom: 22px;">
            行为关系
          </div>
      <el-form>
        <el-form-item>
          <el-form-item>
              <el-checkbox label="lastTime" name="consumptionTimes">
                最近有消费
                <el-input size="mini" class="marginLR" style="width: 70px"></el-input> 天内
              </el-checkbox>
          </el-form-item>
<!--          <el-checkbox-group v-model="consumptionTimes">-->
<!--            <el-checkbox label="lastTime" name="consumptionTimes">-->
<!--              累计消费金额-->
<!--              <el-input size="mini" class="marginLR" style="width: 70px"></el-input>元<span style="margin-left: 10px">一</span><el-input class="marginLR" size="mini" style="width: 70px"></el-input>元-->
<!--            </el-checkbox>-->
<!--          </el-checkbox-group>-->
        </el-form-item>
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
</style>
