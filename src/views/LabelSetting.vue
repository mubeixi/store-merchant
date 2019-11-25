<template>
  <div class="labelManagement">
    <div class="labelMain">
      <el-form size="small">
        <el-form-item  label="人群对象："  >
          <el-select  placeholder="请选择"   style="width: 200px">
            <el-option label="0" value="哈哈"></el-option>
            <!--                  <template v-for="(shop,shopIn) in prodConfig.shop_damage">-->
            <!--                    <el-option :label="shop.Damage_Name" :value="shop.Damage_ID"></el-option>-->
            <!--                  </template>-->
          </el-select>
        </el-form-item>

        <el-form-item  label="选择标签："  >
          <el-select  placeholder="请选择"   style="width: 200px">
            <el-option label="0" value="哈哈"></el-option>
            <!--                  <template v-for="(shop,shopIn) in prodConfig.shop_damage">-->
            <!--                    <el-option :label="shop.Damage_Name" :value="shop.Damage_ID"></el-option>-->
            <!--                  </template>-->
          </el-select>
        </el-form-item>

        <el-form-item label="发送时间：" class="flex">
          <el-radio-group >
            <el-radio label="0" class="radioTop">
              立即发送
            </el-radio>
            <el-radio label="1" class="radioBottom">
              定时发送
              <el-date-picker
                class="dateTime"
                type="datetime"
                placeholder="选择日期时间">
              </el-date-picker>
            </el-radio>
          </el-radio-group>
        </el-form-item>


        <span class="spanButton cancel">取消</span>
        <span class="spanButton">保存</span>
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

</style>
