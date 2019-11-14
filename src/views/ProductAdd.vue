<template>
  <div class="addProduct">
    <div class="menuset">
        <span class="menusetText">发布商品</span>
    </div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="ruleForm">
      <el-form-item label="商品排序" prop="sort">
        <el-input v-model="ruleForm.sort" class="sortInput"></el-input>
        <span class="sortMsg">注：数字越大，越往前（必须大于0）</span>
      </el-form-item>
      <el-form-item label="商品名称" prop="names">
        <el-input v-model="ruleForm.names"  class="nameInput"></el-input>
      </el-form-item>

      <el-form-item label="商品分类" prop="classification">
          <span class="classificationSpan" @click="bindCateDialogShow=true">选择分类</span>
      </el-form-item>
      <div class="group cate_list" style="margin-left: 104px;margin-bottom: 22px;" v-if="cate_list.length>0">
        <span class="cate_item" v-for="(cate,idx) in cate_list">{{cate.Category_Name}}</span>
      </div>
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

      <el-form-item label="拼团" prop="type" style="margin-bottom: 10px">
        <el-checkbox v-model="ruleForm.type" name="group">是否参与拼团</el-checkbox>
      </el-form-item>
      <div class="group" style="margin-left: 104px;margin-bottom: 22px;" v-if="ruleForm.type">
        <el-form-item label="拼团人数" prop="groupNumber" style="margin-bottom: 0px">
          <el-input v-model.number="ruleForm.groupNumber"  class="sortInput"></el-input>
        </el-form-item>
        <el-form-item label="拼团价格" prop="groupPrice"  style="margin-left: 43px;margin-bottom: 0px">
          <el-input v-model="ruleForm.groupPrice"  class="sortInput"></el-input>
        </el-form-item>
        <el-form-item label="截止时间" prop="groupDate" style="margin-left: 43px;margin-bottom: 0px">
          <el-date-picker
            v-model="ruleForm.groupDate"
            type="datetime"
            placeholder="选择日期时间"
            style="width: 200px" >
          </el-date-picker>
        </el-form-item>
      </div>


      <el-form-item label="商品利润" prop="commodityProfit">
        <el-input v-model="ruleForm.commodityProfit"  class="sortInput sortInputs" ></el-input>
        <span class="sortMsg">注：**********************</span>
      </el-form-item>

      <el-form-item label="商品主图">
        <upload-components
          size="mini"
          :onRemove="removeThumbCall"
          :onSuccess="upThumbSuccessCall"
        />
      </el-form-item>

      <el-form-item label="主图视频及封面">
        <div class="flex">
          <div>
            <upload-components
              type="video"
              accept="video/*"
              size="mini"
              :onRemove="removeVideoCall"
              :onSuccess="upVideoSuccessCall"
            />
          </div>
          <div class="margin15-c">
            <upload-components
              :limit="5"
              size="mini"
              :onRemove="removeImgsCall"
              :onSuccess="upImgsSuccessCall"
            />
          </div>
        </div>


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

      <el-form-item label="商品规格">
       <div class="specs_box">
         <div class="specs_row" v-for="(row,idx_row) in specs" :key="idx_row">
           <span class="label">{{row.title}}</span>
           <div class="" style="width: 110px;margin-left: 10px;display: inline-block;" v-for="(val,idx_val) in row.vals" :key="idx_val">
             <el-input  size="mini"  :value="val" />
           </div>
           <span class="margin15-c" style="cursor: pointer;color: #155bd4">添加规格值</span>
         </div>
         <div>
           <el-button size="small" type="primary" @click="createSkuData">生成skus</el-button>
         </div>
       </div>
      </el-form-item>

      <el-form-item label="商品参数" v-show="skus.length>0">
        <div class="sku_box">
          <table class="table" cellspacing="0" cellpadding="0" >
            <tr class="tr">
              <th class="th" v-for="(spec,idx) in specs">{{spec.title}}</th>
              <th class="th">价格</th>
              <th class="th">库存</th>
              <th class="th">成本价</th>
            </tr>
            <template v-for="(sku,idx) in skus">
              <tr class="tr">
                <template v-if="idx%getRowsSpan(index)===0">
                  <template v-for="(i,index) in specs.length">
                      <td class="td" :rowspan="getRowsSpan(index,idx)">{{sku[index]}}</td>
                  </template>
                </template>
                <td class="td"><el-input size="mini" /></td>
                <td class="td"><el-input size="mini" /></td>
                <td class="td"><el-input size="mini" /></td>
              </tr>
            </template>

          </table>

        </div>
      </el-form-item>


      <el-form-item label="商品重量" prop="productWeight">
        <el-input v-model="ruleForm.productWeight"  class="sortInput" ></el-input>
      </el-form-item>
      <el-form-item label="运费计算" prop="goods">
        <el-radio-group v-model="ruleForm.goods">
          <el-radio label="mian" style="display: block;margin-bottom: 15px" >
            免运费
              <el-select  v-model="ruleForm.freight" placeholder="请选择类型"  style="width: 200px;margin-left: 37px;">
                <el-option label="区域一" value="shanghai"></el-option>
                <el-option label="区域二" value="beijing"></el-option>
              </el-select>
          </el-radio>
          <el-radio label="wu" style="display: block;margin-bottom: 15px" >物流模板</el-radio>
          <el-radio label="gu" style="display: block;margin-bottom: 15px" >
            固定运费
            <el-input  v-model="ruleForm.freightGu"  class="sortInput" placeholder="运费金额：¥" style="width: 200px;margin-left: 23px;"></el-input>
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="其他属性" prop="otherAttributes">
        <el-checkbox-group v-model="ruleForm.otherAttributes">
          <el-checkbox label="下架" name="otherAttributes"></el-checkbox>
          <el-checkbox label="新品" name="otherAttributes"></el-checkbox>
          <el-checkbox label="热卖" name="otherAttributes"></el-checkbox>
          <el-checkbox label="推荐" name="otherAttributes"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="关联门店" prop="classification">
        <span class="classificationSpan">选择门店</span>
      </el-form-item>
      <el-form-item label="订单类型" prop="orderType">
        <el-radio-group v-model="ruleForm.orderType">
          <el-radio label="shi" style="display: block;margin-bottom: 15px" >实物订单  <span class="font12">( 买家下单 -> 买家付款 -> 商家发货 -> 买家收货 -> 订单完成 )</span> </el-radio>
          <el-radio label="xu" style="display: block;margin-bottom: 15px" >虚拟订单  <span class="font12">( 买家下单 -> 买家付款 -> 系统发送消费券码到买家手机 -> 商家认证消费 -> 订单完成 )</span></el-radio>
          <el-radio label="qi" style="display: block;margin-bottom: 15px" >其他  <span class="font12">( 买家下单 -> 买家付款 -> 订单完成 )</span> </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="商品库存" prop="productStock">
        <el-input v-model="ruleForm.productStock"  class="sortInput"></el-input>
        <span class="sortMsg">注:若不限则填写10000</span>
      </el-form-item>
      <el-form-item label="退货损坏说明" prop="refund">
        <el-select v-model="ruleForm.refund" placeholder="请选择类型"  style="width: 600px">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="商品详情">
        <div>
          <wzw-editor id="container" height="400px" width="800px" :content.sync="editorText"
                      :afterChange="afterChange()"
                      pluginsPath="../../../static/kindeditor/plugins/"
                      :loadStyleMode="false"
                      @on-content-change="onContentChange"></wzw-editor>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>

    <bind-cate-components
      :multiple="true"
      @cancel="bindCateCancel"
      :onSuccess="bindCateSuccessCall"
      :pageEl="pageEl"
      :show="bindCateDialogShow"/>

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
    import UploadComponents from "@/components/comm/UploadComponents.vue";
    import BindCateComponents from '@/components/BindCateComponents.vue';
    import {calcDescartes} from "@/common/utils";

    /**
     * 获取二维数组（一维数组的元素也是数组)的指定位置开始到最后的长度叠加成绩
     * @param arr
     * @param startIdx
     */
    const getArrayMulite = (arr,startIdx)=>{
        let rt = 1;
        for(var i=startIdx+1;i<arr.length;i++){
            rt *= arr[i].length
        }
        return rt;
    }


    @Component({
        mixins:[],
        components: {
            UploadComponents,BindCateComponents
        }
    })

    export default class AddProduct extends Vue {

        pageEl = this
        bindCateDialogShow = false
        editorText =  '' // 双向同步的变量
        editorTextCopy =  ''  // content-change 事件回掉改变的对象

        onContentChange (val) {
            this.ruleForm.content = val;
        }

        afterChange () {
        }

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
            freightIs:(rule, value, callback) => {
               if(value=='mian'){
                   if(!this.ruleForm.freight)callback(new Error('请选择运费类型'))
               }
                if(value=='gu'){
                    if(!this.ruleForm.freightGu)callback(new Error('请输入运费'))
                }
                callback();
            },
        }

        spec_val_list = []
        specs = [
            {title:'颜色',vals:['黑色','白色','红色']},
            {title:'尺码',vals:['X','M','L']},
            {title:'面料',vals:['羊毛','牛毛','鹅毛']},
            {title:'产地',vals:['美国','台湾','大陆','泰国']},
        ]

        skus = [];

        createSkuData(){
            let spec_arr = this.specs.map(item=>{
                return item.vals
            })
            console.log(spec_arr)
            this.spec_val_list = spec_arr
            this.skus = calcDescartes(spec_arr)
        }

        getRowsSpan(specsIndex){
            return getArrayMulite(this.spec_val_list,specsIndex);
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
            content:'',//富文本
            orderType:'shi',//订单类型
            freight:'',//运费
            freightGu:'',//固定运费
        }
        rules = {
            sort: [
                {required: true,message: '请输入商品排序', trigger: 'blur' }
            ],
            names:[
                { required: true, message: '请输入商品名称', trigger: 'blur' }
            ],
            Virtualsales:[
                { required: true, message: '请输入虚拟销量', trigger: 'blur' },
                { type: 'number', message: '虚拟销量必须为数字值'}
            ],
            originalPrice:[
                { required: true, message: '请输入原价',trigger: 'blur' }
            ],
            currentPrice:[
                { validator:this.validateFn.pass, trigger: 'blur' }
            ],
            groupNumber:[
                {validator:this.validateFn.groupNumber, trigger: 'blur' },
                { type: 'number', message: '拼团人数必须为数字值'}
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
                { validator:this.validateFn.freightIs, trigger: 'change' }
            ],
            orderType:[
                { required: true, message: '请选择订单类型', trigger: 'change' }
            ]
        }
        imgs = []//展示图
        video = ''//视频
        thumb = ''//主图
        cate_list = []
        cate_ids = ''

        removeThumbCall(file){
            this.thumb = ''
        }

        upThumbSuccessCall(file){
            this.thumb = file.path
        }

        removeImgsCall(file){
            let idx = this.imgs.indexOf(file.path);
            console.log(idx)
            if(idx!=-1){
                this.imgs.splice(idx,1);
            }
        }

        upImgsSuccessCall(file){
            this.imgs.push(file.path)
        }

        removeVideoCall(file){
            this.video = ''
        }

        upVideoSuccessCall(file){
            this.video = file.path
        }

        submitForm(formName) {
            //@ts-ignore
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
            //@ts-ignore
            this.$refs[formName].resetFields();
        }

        bindCateCancel(){
            this.bindCateDialogShow = false
        }

        bindCateSuccessCall(dataType, type, path, tooltip, dataArr, pageEl, idx2){
            console.log(dataType, type, path, tooltip, dataArr, pageEl, idx2)
            this.cate_list = dataArr.map(cate=>{
                return {Category_Name:cate.Category_Name,Category_ID:cate.Category_ID}
            })

            let ids = this.cate_list.map(cate=>{
                return cate.Category_ID
            })

            this.cate_ids = ids.join('|')
            this.bindCateDialogShow = false
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
      margin-right: 24px;
      padding: 10px 24px;
      //height:78px;
      background:rgba(248,248,248,1);

      display: flex;
      align-items: center;
      &.cate_list{
        flex-wrap: wrap;
      }
      .cate_item{
        margin-right: 10px;
        line-height: 36px;
        height: 36px;
        cursor: pointer;
      }
    }
  }


}

@borderColor:#eee;
.sku_box{
  margin-right: 20px;
}
.table{
  width: 100%;
  margin-right: 20px;
  border-left: 1px solid @borderColor;
  border-top: 1px solid @borderColor;
  .tr{

    .td,.th{
      padding: 0 20px;

      border-right: 1px solid @borderColor;
      border-bottom: 1px solid @borderColor;
      text-align: center;
    }
    .th{

    }
  }
}




</style>
