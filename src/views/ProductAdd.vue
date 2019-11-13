<template>
  <div class="addProduct">
    <div class="menuset">
        <span class="menusetText">发布商品</span>
    </div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="ruleForm">
      <el-form-item label="商品排序" prop="sort">
        <el-input v-model="ruleForm.sort" class="sortInput"></el-input>
        <span class="sortMsg">注：数字越大，越往前（必须大于0）</span>
      </el-form-item>
      <el-form-item label="商品名称" prop="names">
        <el-input v-model="ruleForm.names"  class="nameInput"></el-input>
      </el-form-item>

      <el-form-item label="商品分类" prop="classification">
          <span class="classificationSpan">选择分类</span>
      </el-form-item>
      <el-form-item label="虚拟销量" prop="Virtualsales">
        <el-input v-model.number="ruleForm.Virtualsales"  class="sortInput"></el-input>
        <span class="sortMsg">注：**********************</span>
      </el-form-item>

      <el-form-item label="产品价格">
        <el-form-item prop="originalPrice" style="display: inline-block">
          <el-input v-model="ruleForm.originalPrice"  placeholder="原价:¥" class="sortInput"></el-input>
        </el-form-item>
        <el-form-item  prop="currentPrice" style="display: inline-block">
          <el-input v-model="ruleForm.currentPrice"  placeholder="现价:¥" class="sortInput" style="margin-left: 18px"></el-input>
        </el-form-item>
      </el-form-item>

      <el-form-item label="拼团" prop="type">
        <el-checkbox v-model="ruleForm.type" name="group">是否参与拼团</el-checkbox>
      </el-form-item>
      <div class="group">
        <el-form-item label="拼团人数" prop="groupNumber">
          <el-input v-model.number="ruleForm.groupNumber"  class="sortInput"></el-input>
        </el-form-item>
        <el-form-item label="拼团价格" prop="groupPrice"  style="margin-left: 43px">
          <el-input v-model.number="ruleForm.groupPrice"  class="sortInput"></el-input>
        </el-form-item>
        <el-form-item label="截止时间" prop="groupDate" style="margin-left: 43px">
          <el-date-picker
            v-model="ruleForm.groupDate"
            type="datetime"
            placeholder="选择日期时间"
            style="width: 200px" >
          </el-date-picker>
        </el-form-item>
      </div>


      <el-form-item label="商品利润" prop="commodityProfit">
        <el-input v-model.number="ruleForm.commodityProfit"  class="sortInput sortInputs" ></el-input>
        <span class="sortMsg">注：**********************</span>
      </el-form-item>

      <el-form-item label="商品简介" prop="productDescription">
        <el-input type="textarea" v-model="ruleForm.productDescription" style="width: 600px"></el-input>
      </el-form-item>
      <el-form-item label="商品类型" prop="productTypes">
        <el-select v-model="ruleForm.productTypes" placeholder="请选择类型"  style="width: 600px">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="商品重量" prop="productWeight">
        <el-input v-model.number="ruleForm.productWeight"  class="sortInput" ></el-input>
      </el-form-item>

      <el-form-item label="运费计算" prop="goods">
        <el-radio-group v-model="ruleForm.goods">
          <el-radio label="mian" style="display: block;margin-bottom: 15px" >
            免运费
<!--              <el-select  placeholder="请选择类型"  style="width: 200px;margin-left: 37px;">-->
<!--                <el-option label="区域一" value="shanghai"></el-option>-->
<!--                <el-option label="区域二" value="beijing"></el-option>-->
<!--              </el-select>-->
          </el-radio>
          <el-radio label="wu" style="display: block;margin-bottom: 15px" >物流模板</el-radio>
          <el-radio label="gu" style="display: block;margin-bottom: 15px" >
            固定运费
            <el-input   class="sortInput" placeholder="运费金额：¥" style="width: 200px;margin-left: 23px;"></el-input>
          </el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="其他属性" prop="otherAttributes">
        <el-radio-group v-model="ruleForm.otherAttributes">
          <el-radio label="下架" ></el-radio>
          <el-radio label="新品" ></el-radio>
          <el-radio label="热卖" ></el-radio>
          <el-radio label="推荐" ></el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="关联门店" prop="classification">
        <span class="classificationSpan">选择门店</span>
      </el-form-item>

      <el-form-item label="订单类型" prop="orderType">
        <el-radio-group v-model="ruleForm.orderType">
          <el-radio label="shi" style="display: block;margin-bottom: 15px" >实物订单  ( 买家下单 -> 买家付款 -> 商家发货 -> 买家收货 -> 订单完成 ) </el-radio>
          <el-radio label="xu" style="display: block;margin-bottom: 15px" >虚拟订单  ( 买家下单 -> 买家付款 -> 系统发送消费券码到买家手机 -> 商家认证消费 -> 订单完成 )</el-radio>
          <el-radio label="qi" style="display: block;margin-bottom: 15px" >其他  ( 买家下单 -> 买家付款 -> 订单完成 ) </el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="商品库存" prop="productStock">
        <el-input v-model.number="ruleForm.productStock"  class="sortInput"></el-input>
        <span class="sortMsg">注:若不限则填写10000</span>
      </el-form-item>

      <el-form-item label="退货损坏说明" prop="refund">
        <el-select v-model="ruleForm.refund" placeholder="请选择类型"  style="width: 600px">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>


      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
    import {
        Component,
        Vue
    } from 'vue-property-decorator';
    import {
        Action,
        State
    } from 'vuex-class'
    import ca from 'element-ui/src/locale/lang/ca'
    import fa from "element-ui/src/locale/lang/fa";



    @Component({
        mixins:[],
        components: {

        }
    })





    export default class AddProduct extends Vue {


        validateFn = {
            pass:(rule, value, callback) => {

                if (value === '') {
                    callback(new Error('请输入现价'));
                } else {
                    if (value >= this.ruleForm.originalPrice) {
                        callback(new Error('现价应低于原价'));
                    }
                    callback();
                }
            },
            groupNumber:(rule, value, callback) => {

                if (this.ruleForm.type && !this.ruleForm.groupNumber)callback(new Error('请输入拼团人数'))
                callback();

            },
            groupPrice:(rule, value, callback) => {

                if (this.ruleForm.type && !this.ruleForm.groupPrice)callback(new Error('请输入拼团价格'))
                callback();

            },
            groupDate:(rule, value, callback) => {

                if (this.ruleForm.type && !this.ruleForm.groupDate)callback(new Error('请输入拼团截止时间'))
                callback();

            },
        }



        ruleForm =  {
            sort: '',//商品排序
            names:'',//商品名称
            Virtualsales:'',//虚拟销量
            originalPrice:'',//原价
            currentPrice:'',//现价
            groupNumber:'',//拼团人数
            groupPrice:'',//拼团价格
            groupDate:'',//拼团时间
            commodityProfit:'',//商品利润
            productDescription:'',//商品简介
            productTypes: 'shanghai',//商品类型
            productWeight:'',//商品重量
            otherAttributes:[],//其他属性
            productStock:'',//商品库存
            refund:'',//退货说明
            goods:'mian',//运费
            type:false,//是否拼团
            orderType:'',//订单类型
        }




        rules = {
            sort: [
                {required: true,message: '请输入商品排序', trigger: 'blur' }
            ],
            names:[
                { required: true, message: '请输入商品名称', trigger: 'blur' }
            ],
            Virtualsales:[
                { required: true, message: '请输入虚拟销量', trigger: 'blur' }
            ],
            originalPrice:[
                { required: true, message: '请输入原价',trigger: 'blur' }
            ],
            currentPrice:[
                { validator:this.validateFn.pass, trigger: 'blur' }
            ],
            groupNumber:[
                {validator:this.validateFn.groupNumber,message: '请输入原价', trigger: 'blur' }
            ],
            groupPrice:[
                { validator:this.validateFn.groupPrice, trigger: 'blur' }
            ],
            groupDate:[
                { type: 'date', validator:this.validateFn.groupDate, trigger: 'change' }
            ],
            commodityProfit:[
              { required: true, message: '请输入商品利润', trigger: 'blur' }
            ],
            productDescription:[
                { required: true, message: '请输入商品简介', trigger: 'blur' }
            ],

            productTypes: [
                { required: true, message: '请选择商品类型', trigger: 'change' }
            ],
            productWeight:[
                { required: true, message: '请输入商品重量', trigger: 'change' }
            ],
            productStock:[
                { required: true, message: '请输入商品库存', trigger: 'change' }
            ],
            refund:[
                { required: true, message: '请选择退货类型', trigger: 'change' }
            ],
            goods:[
                { required: true, message: '请选择运费类型', trigger: 'change' }
            ],
            orderType:[
                { required: true, message: '请选择订单类型', trigger: 'change' }
            ]
        }


        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    alert('submit!');
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        }
        resetForm(formName) {
            this.$refs[formName].resetFields();
        }

    }
    // export default {
    //     name: "AddProduct",
    //     data() {
    //         return {
    //
    //         };
    //     },
    //     methods: {
    //
    //     }
    // }
</script>

<style scoped lang="less">
.addProduct{
  padding-top:0px;
  margin:0px auto 0;
  background-color: #f2f2f2;
  .menuset{
    box-sizing: border-box;
    width: 100%;
    height: 58px;
    color: #333333;
    padding-left: 14px;
    background-color: #FFFFFF;
    display: flex;
    align-items: center;
    .menusetText{
      font-size: 16px;
      line-height: 34px;
    }
  }

  .ruleForm{
    background-color: #fff;
    margin: 0 auto;
    width: 98%;
    margin-top: 15px;
    padding: 26px 0px 0px 32px;
    box-sizing: border-box;
    font-size: 14px;
    color: #666666;
    .sortInput{
      width: 160px;
      position: relative;
    }
    .sortInputs{
      &:after{
        display: block;
        content: '%';
        position: absolute;
        right: 5px;
        top: 0;
        color: #CACACA;
      }
    }
    .nameInput{
      width: 600px;
    }
    .sortMsg{
      font-size: 12px;
      color: #B6B6B6;
      margin-left: 15px;
    }
    .classificationSpan{
      width:160px;
      height:38px;
      line-height: 38px;
      text-align: center;
      background:rgba(66,140,247,1);
      border-radius:2px;
      font-size: 14px;
      color: #FFFFFF;
      display: block;
      cursor: pointer;
    }
    .group{
      width:98%;
      height:78px;
      background:rgba(248,248,248,1);
      padding-left: 24px;
      display: flex;
      align-items: center;
    }
  }


}




</style>
