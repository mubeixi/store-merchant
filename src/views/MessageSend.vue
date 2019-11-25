<template>
  <div class="labelManagement">
    <div class="labelMain flex">
          <div style="margin-left: 15%;width: 350px;height: 100px;background-color: #ff4444">
              123123
          </div>
          <div class="floatRight">
            <el-form size="small">
              <el-form-item label="群发对象：" class="flexCenter">
                <el-radio-group >
                  <el-radio label="0">
                    输入手机号
                  </el-radio>
                  <el-radio label="1">
                    按人群筛选
                  </el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item  class="flexCenter" style="padding-left: 84px">
                <el-input></el-input>
              </el-form-item>
              <el-form-item class="flexCenter" style="padding-left: 84px">
                <el-select  placeholder="请选择"   style="width: 200px">
                  <el-option label="0" value="哈哈"></el-option>
<!--                  <template v-for="(shop,shopIn) in prodConfig.shop_damage">-->
<!--                    <el-option :label="shop.Damage_Name" :value="shop.Damage_ID"></el-option>-->
<!--                  </template>-->
                </el-select>
                <div class="error">当前可送达人数为0，请重新选择人群</div>
              </el-form-item>

              <el-form-item label="短信内容：" class="flex">
                <div class="messageBorder">
                      <div class="messageHeader">
                              <span class="current">选择模板</span> | <span class="current">存为新模板</span>
                      </div>
                      <div class="messageInput">
                        <el-input
                          type="textarea"
                          :autosize="{ minRows: 4}"
                          style="min-height: 85px;border: 0px"
                          placeholder="此处为短信模板内容"
                          resize="none"
                          v-model="textarea2">
                        </el-input>
                      </div>
                </div>
              </el-form-item>

              <el-form-item label="短信签名：" class="flex">
                <span>【网中网】</span><span class="colorF current">修改</span><span class="spanMarginLeft">（本月还能修改2次）</span>
                <div class="error">短信签名不能包含【网中网】，请修改</div>
              </el-form-item>

              <el-form-item label="发送时间：" class="flex">
                <el-radio-group >
                  <el-radio label="0" class="radioTop">
                    立即发送
                  </el-radio>
                  <el-radio label="1" class="radioBottom">
                    定时发送
                    <el-date-picker
                      style="margin-left: 18px"
                      type="datetime"
                      placeholder="选择日期时间">
                    </el-date-picker>
                  </el-radio>
                </el-radio-group>
              </el-form-item>


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
    margin-left: 110px;
  }
  .error{
    color: #F43131;
    font-size: 12px;
  }
.messageBorder{
  width: 280px;
  border: 1px solid #E4E4E4;
  box-sizing: border-box;
  padding-left: 10px;
  padding-right: 10px;
  min-height: 180px;
  padding-bottom: 20px;
  .messageHeader{
    height: 36px;
    line-height: 36px;
    font-size: 14px;
    color: #428CF7;
    border-bottom: 1px solid #E4E4E4;
  }
  .messageInput{
    padding: 22px 10px 0px 10px;
    font-size: 14px;
    color: #666666;
    line-height:24px;
  }
}

  .colorF{
    color: @bgColor;
  }

  .spanMarginLeft{
    margin-left: 12px;
    color: #999999;
    font-size: 12px;
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
  .current{
    cursor: pointer;
  }

</style>
