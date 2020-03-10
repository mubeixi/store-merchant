<template>
  <div class="same-city">
      <div class="same-main">
            <div class="same-top flex">
                <div class="flex1">
                  <div class="same-top-top">同城配送功能</div>
                  <div class="same-top-bottom">启用后，买家下单可以选择同城配送，由你提供上门配送服务</div>
                </div>
                <div class="el-switchs">
                  <el-switch v-model="form"></el-switch>
                </div>
            </div>
        <el-form size="small" :rules="rules" ref="ruleForm" :inline-message="true" label-width="130px"   class="ruleForm">
            <el-form-item label="取货地址:" prop="Products_Index" class="padding-tb-30 line12">
              郑州市金水区文化路东风路硅谷广场A座2208室      联系电话：13688888888   <span class="update-address">修改</span>
            </el-form-item>

            <el-form-item label="业务类型:" prop="Products_Index" class="line12">
                <div class="radio-same">
                  <el-radio-group v-model="forms">
                    <el-radio label="美食" class="radio-wid"></el-radio>
                    <el-radio label="美发" class="radio-wid"></el-radio>
                    <el-radio label="水果生鲜" class="radio-wid"></el-radio>
                    <el-radio label="服装" class="radio-wid"></el-radio>
                    <el-radio label="电器" class="radio-wid"></el-radio>
                    <el-radio label="水果生鲜" class="radio-wid"></el-radio>
                    <el-radio label="电器" class="radio-wid"></el-radio>
                    <el-radio label="水果生鲜" class="radio-wid"></el-radio>
                    <el-radio label="电器" class="radio-wid"></el-radio>
                    <el-radio label="水果生鲜" class="radio-wid"></el-radio>
                  </el-radio-group>
                </div>
                <el-button type="primary" size="mini">保存</el-button>
            </el-form-item>

            <el-form-item label="服务商:" prop="Products_Index" style="margin-top: 30px"  class="line12">
                <div class="fuwushang">
                    <div class="item-fuwushang">
                          <div class="item-name">
                              达达
                          </div>
                          <div class="item-right">
<!--                                <div class="kaitong">-->
<!--                                  已开通-->
<!--                                </div>-->
                                <div class="kaitong">
                                  <div class="kaitong-6">
                                    审核中
                                  </div>
                                  <div class="kaitong-9">
                                    预计2个工作日审核完成
                                  </div>
                                </div>
                                <div class="flex item-right-last">
                                    <div>
                                      配费说明
                                      <img src="@/assets/img/wenhao.png">
                                    </div>
                                </div>
                                <div class="flex item-right-last" style="margin-left: 30px">
                                  <div>
                                    申请开通
                                  </div>
                                </div>
                                <div class="flex item-right-last" style="margin-left: 30px;color: #428CF7">
                                  <div>
                                    查询余额
                                  </div>
                                </div>
                          </div>
                    </div>

                </div>
            </el-form-item>


            <el-form-item label="智能配送:" prop="Products_Index" style="margin-top: 40px"  class="line12">
              <el-radio-group v-model="forms">
                <el-radio label="开启"></el-radio>
                <el-radio label="关闭"></el-radio>
              </el-radio-group>
              <div class="shuoming">
                开启后，系统会默认选中配送费最低的服务商，您也可自定义设置
              </div>
            </el-form-item>

            <el-form-item label="费用配置:" prop="Products_Index" style="color: #666666">
                <el-input class="input-width"></el-input>
                km内按
                <el-input class="input-width"></el-input>
                元收取配送费，每超出
                <el-input class="input-width"></el-input>
                km费用增加
                <el-input class="input-width"></el-input>
                元
            </el-form-item>

            <el-form-item label="续重收费:" prop="Products_Index" style="color: #666666;margin-top: 40px;">
              商品重量
              <el-input class="input-width"></el-input>
              kg内不额外收费，每超出
              <el-input class="input-width"></el-input>
              kg费用增加
              <el-input class="input-width"></el-input>
              元
              <div class="include">
                <div>
                  说明：1. 最终费用=收费标准+续重收费（数值为0时表示不使用续重收费）
                </div>
                <div style="margin-left: 42px">
                  2. 需要对续重收费的商品开启该功能，并设置商品重量
                </div>
              </div>
            </el-form-item>
            <el-button type="primary" class="last-button" size="small">保存</el-button>
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

    export default class SameCityDelivery extends Vue {
        form=true
        forms=1
        async created(){


        }




    }

</script>

<style scoped lang="less">
  .same-city{
    padding: 20px 0px 0px 20px;
    height: 100vh;
    width: 100%;
    background-color: #f5f5f5;
    box-sizing: border-box;
  }
  .same-main{
    background-color: #ffffff;
    width: 100%;
    padding-top: 30px;
  }
  .same-top{
    width: 70%;
    height: 150px;
    background-color: #f5f5f5;
    margin-left: 30px;
  }
  .same-top-top{
    color: #333333;
    font-size: 16px;
    font-weight: bold;
    height: 16px;
    line-height: 16px;
    padding-top: 45px;
    padding-left: 36px;
  }
  .same-top-bottom{
    color: #666666;
    font-size: 14px;
    height: 13px;
    line-height: 13px;
    padding-top: 31px;
    padding-left: 37px;
  }
  .el-switchs{
    width: 100px;
    height: 150px;
    line-height: 150px;
  }
  .el-form{
    font-size: 14px;
    color:#666666;
  }
  .padding-tb-30{
    padding-top: 30px;
    padding-bottom: 30px;
  }
  .el-form-item{
    margin-bottom: 0px !important;
  }
  .update-address{
    color: #428CF7;
    cursor: pointer;
    margin-left: 10px;
  }
  .line12 /deep/ .el-form-item__label,.line12 /deep/ .el-form-item__content{
    line-height: 12px !important;
  }

  .radio-same{
    width: 550px;
  }
  .radio-wid{
    margin-bottom: 15px;
    width: 70px;
  }
  .fuwushang{
    width: 835px;
    border: 1px solid #EAEAEA;
    box-sizing: border-box;
  }
  .item-fuwushang{
    width: 835px;
    background-color: #ffffff;
    height: 70px;
    display: flex;
    border-bottom: 1px solid #EAEAEA;
    &:last-child{
      border-bottom: 0px;
    }
    .item-name{
      width: 138px;
      font-size: 14px;
      color: #666666;
      height: 70px;
      line-height: 70px;
      text-align: center;
      background-color: #F8F8F8;
      border-right: 1px solid #EAEAEA;
      box-sizing: border-box;
    }
    .item-right{
      width: 697px;
      border-right: 1px solid #EAEAEA;
      display: flex;
    }
  }

  .kaitong{
    width: 407px;
    height: 70px;
    line-height: 70px;
    font-size: 14px;
    color: #38CA2C;
    padding-left: 53px;
    box-sizing: border-box;
  }
  .kaitong-6{
    color: #666666;
    height: 12px;
    line-height: 12px;
    margin-top: 16px;
    margin-bottom: 12px;
  }
  .kaitong-9{
    color: #999999;
    height: 13px;
    line-height: 13px;
  }
  .item-right-last{
    height: 70px;
    line-height: 70px;
    font-size: 14px;
    color: #999999;
    cursor: pointer;
  }
  .shuoming{
    margin-top: 17px;
    margin-bottom: 40px;
    font-size: 14px;
    color: #999999;
  }
  .input-width{
    width: 64px;
  }
  .include{
    margin-top: 25px;
    font-size: 14px;
    color: #999999;
  }
  .last-button{
    margin: 83px 0px 71px 171px;
    width: 92px;
    height: 37px;
  }
</style>
