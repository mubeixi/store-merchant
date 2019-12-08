<template>
  <div class="labelManagement">
    <div class="labelMain">
      <el-form size="small">
        <el-form-item  label="级别名称：" class="marginLR">
          <el-input style="width: 350px"></el-input>
        </el-form-item>

        <el-form-item  label="级别描述：" class="marginLR">
          <el-input
            style="width: 480px"
            type="textarea"
            resize="none"
            :autosize="{ minRows: 3, maxRows: 10}"
            placeholder="请输入内容"
            v-model="textarea">
          </el-input>
        </el-form-item>

        <el-form-item label="级别标识："  class="marginLR labelCenter">
          <div class="divFlex">
            <upload-components
              size="mini"
              ref="thumb"
              :limit="1"
              tip="上传标识图片"
              :onSuccess="upThumbSuccessCall"
            />
            <div class="labelDiv">
              图片建议尺寸：30*30像素
            </div>
          </div>
        </el-form-item>

        <el-form-item  label="佣金人数限制：" class="marginLRS divFlex">
          <div class="divFlex">
            <div class="marginRight">
              一级<el-input  class="inputMargin"></el-input>个
            </div>
            <div class="marginRight">
              二级<el-input class="inputMargin"></el-input>个
            </div>
            <div  class="marginRight">
              三级<el-input  class="inputMargin"></el-input>个
            </div>
          </div>
          <div class="fontSize">
            注：此级别的分销商获得佣金的人数限制。如：一级 3、二级 -1、三级 -1，说明此级别分销商只能获得3个下属的一级佣金，不能获得二级、三级佣金；
            0表示不限制，-1 表示禁止获得此级别佣金。此设置对于发展下级会员人数不起作用
          </div>
        </el-form-item>


        <el-form-item  label="达标方式选择：" class="marginLRS divFlex">
        <el-radio-group v-model="qwe">
          <el-radio label="0" >满足任一条件</el-radio>
          <el-radio label="1" >满足全部条件</el-radio>
          <el-radio label="2" >不限制</el-radio>
          <el-radio label="3" >手动申请</el-radio>
        </el-radio-group>
        <block>
          <div class="myCenter">
            <!--     消费额       -->
            <el-checkbox-group v-model="qwe">
              <el-checkbox label="lastTime" name="lastTime">消费额</el-checkbox>
            </el-checkbox-group>
            <div class="first">
              <el-form-item  label="消费类型：" class="divFlex">
                <el-radio-group v-model="qwe">
                  <el-radio label="0" >商城总消费</el-radio>
                  <el-radio label="1" >一次性消费</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item  label="消费金额：" class="divFlex">
                <el-input class="widthInput"></el-input> 元 <span class="spans">（注：用户需消费此额度才能成为该级别分销商）</span>
              </el-form-item>
              <el-form-item  label="生效状态：" class="divFlex">
                <el-radio-group v-model="qwe">
                  <el-radio label="0" >订单付款后计入</el-radio>
                  <el-radio label="1" >订单确认收货后计入</el-radio>
                </el-radio-group>
              </el-form-item>
            </div>
            <!--     购买礼包       -->
            <el-checkbox-group v-model="qwe">
              <el-checkbox label="lastTime" name="lastTime">购买礼包</el-checkbox>
              <el-radio-group v-model="qwe" class="productRadio">
                <el-radio label="0" >任意商品</el-radio>
                <el-radio label="1" >特定商品</el-radio>
              </el-radio-group>
              <span class="selects">选择商品</span>
            </el-checkbox-group>
            <div class="first second">
              <div class="listLine">
                <img src="http://vod.q172.net/image/default/1FB2EA180FD04D689689880F40D1AD5A-6-2.png" class="lineImg">
                <div class="lineDiv">dsadasdasdasdasd</div>
              </div>
            </div>
            <!--    购买商品次数      -->
            <el-checkbox-group v-model="qwe" class="marginBo">
              <el-checkbox label="lastTime" name="lastTime">购买商品次数</el-checkbox>
              <el-input class="inputMy"></el-input><span class="oneFont">次</span>
            </el-checkbox-group>
            <!--    团队销售额      -->
            <el-checkbox-group v-model="qwe" class="marginBo">
              <el-checkbox label="lastTime" name="lastTime">团队销售额</el-checkbox>
              <el-input class="inputMy" style="margin-left: 38px"></el-input><span class="oneFont">元</span>
            </el-checkbox-group>
            <!--    直接购买身份      -->
            <el-checkbox-group v-model="qwe" class="marginBo">
              <el-checkbox label="lastTime" name="lastTime">直接购买身份</el-checkbox>
              <el-select lass="inputMy" style="margin-left: 24px;width: 140px"></el-select>
              <el-input class="inputMy inputT" placeholder="级别金额" ></el-input><span class="oneFont">元</span>
              <el-input class="inputMy inputT" placeholder="赠送金额" ></el-input><span class="oneFont">元</span>
            </el-checkbox-group>
            <!--    直邀等级数量      -->
            <el-checkbox-group v-model="qwe" class="marginBo">
              <el-checkbox label="lastTime" name="lastTime">直邀等级数量</el-checkbox>
              <el-input class="inputMy inputT" ></el-input><span class="oneFont">人</span>
              <el-select lass="inputMy" style="margin-left: 24px;width: 140px"  placeholder="请选择分销等级"></el-select>
            </el-checkbox-group>
            <!--    团队等级数量      -->
            <el-checkbox-group v-model="qwe" class="marginBo" style="display: flex">
              <el-checkbox label="lastTime" name="lastTime">团队等级数量</el-checkbox>
              <div >
                <div>
                  <el-input class="inputMy inputT" ></el-input><span class="oneFont">人</span>
                  <el-select lass="inputMy" style="margin-left: 24px;width: 140px"  placeholder="请选择等级"></el-select>
                  <span class="addSpan">添加</span>
                </div>
              </div>
            </el-checkbox-group>
          </div>
        </block>

<!--        <block>-->
<!--          <div class="amu">-->
<!--            <div class="th">-->
<!--              <div class="td">字段类型</div>-->
<!--              <div class="td">字段名称</div>-->
<!--              <div class="td">初始内容</div>-->
<!--              <div class="td" style="width: 125px">操作</div>-->
<!--            </div>-->
<!--            <div class="tr">-->
<!--              <div class="td">-->
<!--                <el-select class="widthmbx"></el-select>-->
<!--              </div>-->
<!--              <div class="td">-->
<!--                <el-input class="widthmbx"></el-input>-->
<!--              </div>-->
<!--              <div class="td">-->
<!--                <el-input class="widthmbx"></el-input>-->
<!--              </div>-->
<!--              <div class="td" style="width: 125px">-->
<!--                <img src="@/assets/img/mydel.png" style="cursor:pointer;">-->
<!--              </div>-->
<!--            </div>-->
<!--            <el-button type="primary"  style="margin-top: 20px" >确定</el-button>-->
<!--          </div>-->
<!--        </block>-->
      </el-form-item>

        <el-form-item  label="佣金发放限制：" class="marginLRS divFlex">
          <div class="divFlex">
            <div class="marginRight">
              一级<el-input  class="inputMargin"></el-input>元
            </div>
            <div class="marginRight">
              二级<el-input class="inputMargin"></el-input>元
            </div>
            <div  class="marginRight">
              三级<el-input  class="inputMargin"></el-input>元
            </div>
          </div>
          <div class="fontSize">
            注：会员购买此级别时，其上级获得的佣金
          </div>
        </el-form-item>

        <el-form-item class="submit">
          <el-button   class="close" >返回</el-button>
          <el-button type="primary"  class="submits" >确定</el-button>
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
    import UploadComponents from "@/components/comm/UploadComponents.vue";
    import {
        Action,
        State
    } from 'vuex-class'
    import fa from "element-ui/src/locale/lang/fa";
    @Component({
        mixins:[],
        components: {
            UploadComponents
        }
    })

    export default class DistributorLevel extends Vue {

        textarea=''
        qwe="0"

        upThumbSuccessCall(url_list){
           console.log(url_list)
        }
        async created(){


        }




    }

</script>

<style scoped lang="less">
.labelMain{
  padding: 20px 0px;
  .marginLR{
    margin-left: 22px;
  }
  .marginLRS{
    margin-left: 7px;
  }
}
.divFlex{
  display: flex;
}
.labelCenter{
  display: flex;
  .labelDiv{
    font-size: 7px;
    color: #BCBCBC;
    margin-top: 25px;
    margin-left: 12px;
  }
}
 .labelCenter /deep/ .el-form-item__label{
   margin-top: 25px;
 }
  .marginRight{
    margin-right: 20px;
    font-size: 8px;
    color: #777777;
  }
  .inputMargin{
    margin-left: 10px;
    margin-right: 6px;
    width: 85px;
  }
  .widthInput{
    width: 85px;
  }
  .fontSize{
    color: #BCBCBC;
    font-size: 12px;
    width: 630px;
    margin-top: 10px;
  }
  .myCenter{
    margin-top: 10px;
    background-color: #F8F8F8;
    padding: 11px 152px 21px 17px;
    .first{
      margin-left: 18px;
      margin-bottom: 15px;
      background-color: #ffffff;
      padding: 10px 50px 20px 16px;
      .spans{
        font-size: 12px;
        color: #BCBCBC;
        margin-left: 17px;
      }
    }
    .productRadio{
      display: inline-block;
      height: 32px;
      line-height: 32px;
      margin-left: 20px;
    }
  }
  .selects{
    color: #428CF7;
    font-size: 12px;
    margin-left: 10px;
    cursor: pointer;
  }

  .second{
    padding: 5px 22px 12px 16px !important;
    .listLine{
      height: 46px;
      display: flex;
      align-items: center;
      border-bottom: 1px dotted #DBDBDB;
      .lineImg{
        width: 30px;
        height: 30px;
      }
      .lineDiv{
        color: #999999;
        font-size: 12px;
        margin-left: 14px;
      }
    }
  }

  .oneFont{
    font-size: 14px;margin-left: 8px;color: #777777
  }
  .inputMy{
    width: 75px;margin-left: 24px
  }
  .inputT{
    margin-left: 20px;
    & /deep/ .el-input__inner{
      padding-right: 0px;
    }
  }
  .marginBo{
    margin-bottom: 20px;
  }
  .addSpan{
    color: #428CF7;
    font-size: 12px;
    margin-left: 12px;
  }
  .submit{
    margin-left: 380px;
    margin-top: 84px;
    .close{
      margin-right: 20px;
    }
  }

  .amu{
    background-color: #F8F8F8;
    width: 925px;
    padding: 24px 95px 38px 42px;
    box-sizing: border-box;
    border: 1px solid #EEEEEE;
    .th{
      background-color: #F2F7FF;
      display: flex;
      align-items: center;
      height: 48px;
      .td{
        text-align: center;
        width: 220px;
        border-right: 1px solid #EEEEEE;
        &:last-child{
           border: 0px;
         }
      }
    }
    .widthmbx{
      width: 120px;
    }
    .tr{
      height: 60px;
      display: flex;
      align-items: center;
      background-color: #ffffff;
      border-top:1px solid #EEEEEE;
      .td{
        width: 220px;
        height: 60px;
        line-height: 60px;
        text-align: center;
        border-right: 1px solid #EEEEEE;
        &:last-child{
          border: 0px;
        }
      }
    }
  }
</style>
