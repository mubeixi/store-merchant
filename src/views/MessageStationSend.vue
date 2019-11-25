<template>
  <div class="labelManagement">
    <div class="labelMain flex">
      <div class="floatRight">
        <el-form size="small">
          <el-form-item label="群发对象：" class="flexCenter">
            <el-select  placeholder="请选择"   style="width: 200px">
              <el-option label="0" value="哈哈"></el-option>
              <!--                  <template v-for="(shop,shopIn) in prodConfig.shop_damage">-->
              <!--                    <el-option :label="shop.Damage_Name" :value="shop.Damage_ID"></el-option>-->
              <!--                  </template>-->
            </el-select>
          </el-form-item>

          <el-form-item label="短信内容：" class="flex">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 4}"
                  class="haihong"
                  placeholder="此处为短信模板内容"
                  resize="none"
                  v-model="textarea2">
                </el-input>


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
          <div class="submit">保存</div>
        </el-form>
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

    @Component({
        mixins:[],
        components: {

        }
    })

    export default class AddProduct extends Vue {
        textarea2=''
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
      padding-top: 70px;
      padding-left: 24px;
    }
  }
  .flex{
    display: flex;
  }
  .flexCenter{
    display: flex;
    align-items: center
  }
  .floatRight{
    margin-left: 200px;
  }
  .error{
    color: #F43131;
    font-size: 12px;
  }
.haihong{
  min-height: 85px;
  border: 0px;
  width: 280px;
  margin-top: 8px;
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
  .submit{
    background-color: #428CF7;
    color: #FFFFFF;
    width: 90px;
    text-align: center;
    height: 44px;
    line-height: 44px;
    font-size: 16px;
    margin-left: 120px;
    margin-top: 20px;
  }
  .dateTime{
    margin-left: 18px;width: 170px;padding-right: 0px
  }
</style>
