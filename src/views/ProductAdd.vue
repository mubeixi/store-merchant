<template>
  <div class="addProduct">
    <div class="menuset">
        <span class="menusetText">发布商品</span>
    </div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="ruleForm">
      <el-form-item label="商品排序" prop="Products_Index">
        <el-input v-model="ruleForm.Products_Index" class="sortInput"></el-input>
        <span class="sortMsg">注：数字越大，越往前（必须大于0）</span>
      </el-form-item>
      <el-form-item label="商品名称" prop="Products_Name">
        <el-input v-model="ruleForm.Products_Name"  class="nameInput"></el-input>
      </el-form-item>

      <el-form-item label="商品分类" prop="classification">
          <span class="classificationSpan" @click="bindCateDialogShow=true">选择分类</span>
      </el-form-item>
      <div class="group cate_list" style="margin-left: 120px;margin-bottom: 22px;" v-if="cate_list.length>0">
        <span class="cate_item" v-for="(cate,idx) in cate_list">{{cate.Category_Name}}</span>
      </div>
      <el-form-item label="虚拟销量" prop="Products_Sales">
        <el-input v-model.number="ruleForm.Products_Sales"  class="sortInput"></el-input>
        <span class="sortMsg">注：**********************</span>
      </el-form-item>

      <el-form-item label="产品价格">
        <el-form-item prop="Products_PriceY" style="display: inline-block">
          <el-input v-model="ruleForm.Products_PriceY"  placeholder="原价:¥" class="sortInput"></el-input>
        </el-form-item>
        <el-form-item  prop="Products_PriceX" style="display: inline-block">
          <el-input v-model="ruleForm.Products_PriceX"  placeholder="现价:¥" class="sortInput" style="margin-left: 18px"></el-input>
        </el-form-item>
      </el-form-item>

      <el-form-item label="拼团" prop="type" style="margin-bottom: 10px">
        <el-checkbox v-model="ruleForm.pintuan_flag" name="group">是否参与拼团</el-checkbox>
      </el-form-item>
      <div class="group" style="margin-left: 120px;margin-bottom: 22px;" v-if="ruleForm.pintuan_flag">
        <el-form-item label="拼团人数" prop="pintuan_people" style="margin-bottom: 0px">
          <el-input v-model.number="ruleForm.pintuan_people"  class="sortInput"></el-input>
        </el-form-item>
        <el-form-item label="拼团价格" prop="pintuan_pricex"  style="margin-left: 43px;margin-bottom: 0px">
          <el-input v-model="ruleForm.pintuan_pricex"  class="sortInput"></el-input>
        </el-form-item>
        <el-form-item label="截止时间" prop="pintuan_end_time" style="margin-left: 43px;margin-bottom: 0px">
          <el-date-picker
            v-model="ruleForm.pintuan_end_time"
            type="datetime"
            placeholder="选择日期时间"
            style="width: 200px" >
          </el-date-picker>
        </el-form-item>
      </div>

      <el-form-item label="商品利润" prop="Products_Profit">
        <el-input v-model="ruleForm.Products_Profit"  class="sortInput sortInputs" ></el-input>
        <span class="sortMsg">注：**********************</span>
      </el-form-item>

      <el-form-item label="商品主图">
        <upload-components
          size="mini"
          :limit="999999"
          :onRemove="removeThumbCall"
          :onSuccess="upThumbSuccessCall"
        />
      </el-form-item>

      <el-form-item label="主图视频及封面" v-if="prodConfig.is_upload_video==1">
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
              :limit="1"
              size="mini"
              :onRemove="removeImgsCall"
              :onSuccess="upImgsSuccessCall"
            />
          </div>
        </div>


      </el-form-item>

      <el-form-item label="商品简介" prop="Products_BriefDescription">
        <el-input type="textarea" v-model="ruleForm.Products_BriefDescription" style="width: 600px"></el-input>
      </el-form-item>
      <el-form-item label="商品类型" prop="Products_Type">
        <el-select v-model="ruleForm.Products_Type" placeholder="请选择类型"  style="width: 600px">
          <template v-for="(it,ind_con) of prodConfig.prod_type_list">
            <el-option :label="it.Type_Name" :value="it.Type_ID" ></el-option>
          </template>
        </el-select>
      </el-form-item>

      <el-form-item label="商品规格" v-if="ruleForm.Products_Type">
       <div class="specs_box">
         <div class="specs_row" v-for="(row,idx_row) in specs" :key="idx_row">
           <span class="label">{{row.title}}</span>
           <div class="input-wrap"  style="width: 110px;margin-left: 10px;display: inline-block;position: relative" v-for="(val,idx_val) in row.vals" :key="idx_val">
<!--             <el-input  size="mini"   v-model="specs[idx_row].vals[idx_val]" />-->
<!--             <el-select-->
<!--               v-model="specs[idx_row].vals[idx_val]"-->
<!--               size="mini"-->
<!--               filterable-->
<!--               allow-create-->
<!--               >-->
<!--               <el-option-->
<!--                 v-for="item in options"-->
<!--                 :key="item.value"-->
<!--                 :label="item.label"-->
<!--                 :value="item.value">-->
<!--               </el-option>-->
<!--             </el-select>-->
             <el-autocomplete
               class="inline-input"
               :fetch-suggestions="querySearchAsync"
               v-model="specs[idx_row].vals[idx_val]"
               @focus="queryIndex(idx_row)"
             ></el-autocomplete>
             <div class="imgDel" @click="skuDel(idx_row,idx_val)">
               <i class="el-icon-error"></i>
             </div>
           </div>
           <span class="margin15-c" style="cursor: pointer;color: #428CF7" @click="skuAdd(idx_row)">添加规格值</span>
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
              <th class="th" v-if="ruleForm.pintuan_flag">拼团价</th>
            </tr>
            <template v-if="skus.length>1">
              <template v-for="(sku,idx) in skus">
                <tr class="tr">
                  <template v-for="(i,index) in specs.length">
                    <template v-if="idx%getRowsSpan(index)===0">
                      <td class="td" :rowspan="getRowsSpan(index,idx)">{{sku[index]}}</td>
                    </template>
                  </template>
                  <td class="td"><el-input v-if="skuList[idx]" size="mini" v-model="skuList[idx].Attr_Price"/></td>
                  <td class="td"><el-input v-if="skuList[idx]" size="mini" v-model="skuList[idx].Property_count"/></td>
                  <td class="td"><el-input v-if="skuList[idx]" size="mini" v-model="skuList[idx].Supply_Price"/></td>
                  <td class="td" v-if="ruleForm.pintuan_flag"><el-input v-if="skuList[idx]" size="mini" v-model="skuList[idx].pt_pricex"/></td>
                </tr>
              </template>
            </template>
            <template v-if="skus.length==1">
              <template v-for="(item,idx) in skuList">
                <tr class="tr">
                  <td class="td" >{{skuList[idx].Attr_Value}}</td>
                  <td class="td"><el-input v-if="skuList[idx]" size="mini" v-model="skuList[idx].Attr_Price"/></td>
                  <td class="td"><el-input v-if="skuList[idx]" size="mini" v-model="skuList[idx].Property_count"/></td>
                  <td class="td"><el-input v-if="skuList[idx]" size="mini" v-model="skuList[idx].Supply_Price"/></td>
                  <td class="td" v-if="ruleForm.pintuan_flag"><el-input v-if="skuList[idx]" size="mini" v-model="skuList[idx].pt_pricex"/></td>
                </tr>
              </template>
            </template>
            <tr class="tr">
               <td class="td divTd" colspan="9">
                 <span>批量设置：</span>
                 <template v-if="allPrice">
                   <span  class="span" @click="changePrice('price')">价格</span><span class="span" @click="changePrice('count')">库存</span><span class="span" @click="changePrice('supply')">成本价</span><span class="span" @click="changePrice('pintuan')">拼团价</span>
                 </template>
                 <template v-else="!allPrice">
                   <span ><el-input v-model="allValue"  size="mini" style="width: 100px;"/><span class="spans" @click="saveAll">保存</span><span class="spans" @click="delAll">取消</span></span>
                 </template>
               </td>
            </tr>
          </table>
        </div>
      </el-form-item>

      <el-form-item label="商品承诺" prop="Products_Promise">
        <div class="input-wrap"  style="width: 110px;margin-left: 10px;display: inline-block;position: relative"  v-for="(item,index) of Products_Promise" :key="index">
          <el-input  size="mini"   v-model="Products_Promise[index]" @focus="focusCommit(index)"/>
<!--          <img src="@/assets/img/productAdd/del.png" class="imgDel" @click="committedDel(index)">-->
              <div class="imgDel" @click="committedDel(index)">
                <i class="el-icon-error"></i>
              </div>
        </div>
        <span class="margin15-c" style="cursor: pointer;color: #428CF7" @click="committedAdd">添加规格值</span>
      </el-form-item>

      <el-form-item label="商品重量" prop="Products_Weight">
        <el-input v-model="ruleForm.Products_Weight"  class="sortInput" ></el-input>
      </el-form-item>
      <el-form-item label="运费计算" prop="goods">
        <el-radio-group v-model="ruleForm.goods">
          <el-radio label="0" style="display: block;margin-bottom: 15px" >
            免运费
              <el-select  v-model="ruleForm.freight" placeholder="请选择类型"  style="width: 200px;margin-left: 37px;">
                <template v-for="(prod,prodIn) of prodConfig.shipping_company_dropdown">
                  <el-option :label="prodConfig.shipping_company_dropdown[prodIn]" :value="prodIn"></el-option>
                </template>
              </el-select>
          </el-radio>
          <el-radio label="1" style="display: block;margin-bottom: 15px" >物流模板</el-radio>
          <el-radio label="2" style="display: block;margin-bottom: 15px" >
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
        <span class="classificationSpan" @click="dialogStoreShow=true">选择门店</span>
      </el-form-item>
      <el-form-item label="特殊属性"  v-if="prodConfig.Payment_RmainderEnabled==1">
        <el-checkbox-group v-model="ruleForm.Products_IsPaysBalance">
          <el-checkbox label="使用余额支付" value="1" name="Products_IsPaysBalance"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <div class="group store_list" style="margin-left: 120px;margin-bottom: 22px;" v-if="store_list.length>0">
        <div class="store_item" v-for="(store,idx) in store_list">{{store.Stores_Name}}</div>
      </div>
      <el-form-item label="订单类型" prop="orderType">
        <el-radio-group v-model="ruleForm.orderType">
          <el-radio label="0" style="display: block;margin-bottom: 15px" >实物订单  <span class="font12">( 买家下单 -> 买家付款 -> 商家发货 -> 买家收货 -> 订单完成 )</span> </el-radio>
          <el-radio label="1" style="display: block;margin-bottom: 15px" >虚拟订单  <span class="font12">( 买家下单 -> 买家付款 -> 系统发送消费券码到买家手机 -> 商家认证消费 -> 订单完成 )</span></el-radio>
          <el-radio label="2" style="display: block;margin-bottom: 15px" >其他  <span class="font12">( 买家下单 -> 买家付款 -> 订单完成 )</span> </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="商品库存" prop="Products_Count">
        <el-input v-model="ruleForm.Products_Count"  class="sortInput"></el-input>
        <span class="sortMsg">注:若不限则填写10000</span>
      </el-form-item>
      <el-form-item label="退货损坏说明" prop="refund">
        <el-select v-model="ruleForm.refund" placeholder="请选择类型"  style="width: 600px">
          <template v-for="(shop,shopIn) in prodConfig.shop_damage">
            <el-option :label="shop.Damage_Name" :value="shop.Damage_ID"></el-option>
          </template>
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
      :strictly="false"
      mode="productAdd"
      :onSuccess="bindCateSuccessCall"
      :pageEl="pageEl"
      :show="bindCateDialogShow"/>

    <bind-store-component
      @cancel="bindStoreCancel"
      :onSuccess="bindStoreSuccessCall"
      :pageEl="pageEl"
      :show="dialogStoreShow"
    />
    <el-dialog
      title="佣金设置"
      width="90%"
      @close="settingCancel"
      append-to-body
      :visible.sync="commission"
      class="setting"
    >

      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="ruleForm">
        <div class="commissionDiv">
          <div class="titles">
            发放比例
          </div>
          <div class="rightTitle">
            <el-form-item label="" prop="sort" style="margin-bottom: 0px;">
              <el-input  size="mini" v-model="platForm_Income_Reward" style="width: 80px;margin-left: 19px;"></el-input>
              % <span class="msg">（发放金额所占网站利润的百分比；小于100%大于0%）</span>
            </el-form-item>
          </div>
        </div>
        <div class="commissionDiv">
          <div class="titles">
            爵位奖励比例
          </div>
          <div class="rightTitle">
            <el-form-item label="" prop="sort" style="margin-bottom: 0px;">
              <el-input  size="mini" v-model="nobi_ratio" style="width: 80px;margin-left: 19px;"></el-input>
              % <span class="msg">（所占发放比例的百分比）</span>
            </el-form-item>
          </div>
        </div>
        <div class="commissionDiv">
          <div class="titles">
            区域代理比例
          </div>
          <div class="rightTitle">
            <el-form-item label="" prop="sort" style="margin-bottom: 0px;">
              <el-input  size="mini"  v-model="area_Proxy_Reward" style="width: 80px;margin-left: 19px;"></el-input>
              % <span class="msg">（所占发放比例的百分比）</span>
            </el-form-item>
          </div>
        </div>
        <div class="commissionDiv">
          <div class="titles">
            股东佣金比例
          </div>
          <div class="rightTitle">
            <el-form-item label="" prop="sort" style="margin-bottom: 0px;">
              <el-input  size="mini" v-model="sha_Reward" style="width: 80px;margin-left: 19px;"></el-input>
              % <span class="msg">（所占发放比例的百分比）</span>
            </el-form-item>
          </div>
        </div>
        <div class="commissionDiv">
          <div class="titles">
            佣金比例
          </div>
          <div class="rightTitle">
            <el-form-item label="" prop="sort" style="margin-bottom: 0px;">
              <el-input  size="mini" v-model="commission_ratio" style="width: 80px;margin-left: 19px;"></el-input>
              % <span class="msg">（下面佣金返利所占发放比例比例的百分比）</span>
            </el-form-item>
          </div>
        </div>
        <div class="commissionLast">
          <div class="titles" style="width: 20%;border-right: 0px">
            佣金返利 (全部统一)
          </div>
          <div class="aiHai">
            <div class="fenxiaoshang" v-for="(fen,fenIndex) of dis_level_list" :key="fenIndex">
              <div class="fenTitle">{{fen.Level_Name}}</div>
              <div>
                <el-form-item label="" prop="sort" style="margin-bottom: 0px;" v-for="(dis,disIndex) of Dis_Level_arr" :key="disIndex">
                  <span class="label">{{dis}}</span>
                  <el-input  size="mini" style="width: 70px" v-model="distriboutor_config[fenIndex][disIndex]"></el-input>
                  % <span class="msg">（佣金比例的百分比）</span>
                </el-form-item>
                <el-form-item label="" prop="sort" style="margin-bottom: 0px;" v-if="prodConfig.Dis_Self_Bonus==1">
                  <span class="label">自销佣金</span>
                  <!--手动加了一个-->
                  <el-input  size="mini" style="width: 70px" v-model="distriboutor_config[fenIndex][Dis_Level_arr.length]"></el-input>
                  % <span class="msg">（佣金比例的百分比）</span>
                </el-form-item>
              </div>
            </div>

           </div>
        </div>



      </el-form>
      <div class="sure">
        <span class="spans" @click="settingSuccessCall">确认</span>
      </div>
    </el-dialog>
    <div class="setting" @click="commission=true">
      佣金设置
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

    import UploadComponents from "@/components/comm/UploadComponents.vue";
    import BindCateComponents from '@/components/BindCateComponents.vue';
    import {calcDescartes, objTranslate} from "@/common/utils";
    import BindStoreComponent from "@/components/comm/BindStoreComponent.vue";
    import SettingComponent from "@/components/comm/SettingComponent.vue";
    import {systemProdConfig,systemOperateProd} from '@/common/fetch'
    import fa from "element-ui/src/locale/lang/fa";

    import _ from 'underscore';
    import {get_arr_column} from '@/common/utils';

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

        // console.log(rt)
        return rt;
    }



    @Component({
        mixins:[],
        components: {
            BindStoreComponent,
            SettingComponent,
            UploadComponents,BindCateComponents
        }
    })

    export default class AddProduct extends Vue {

        pageEl = this
        bindCateDialogShow = false

        dialogStoreShow = false
        commission=false
        editorText =  '' // 双向同步的变量
        editorTextCopy =  ''  // content-change 事件回掉改变的对象

        onContentChange (val) {
            this.ruleForm.content = val;
        }

        afterChange () {
        }

        prodConfig={
            prod_type_list:[],
            shipping_company_dropdown:{},
            Shop_Commision_Reward_Json:{}
        };

        distriboutor_config = null;
        Dis_Level_arr = []
        dis_level_list = []
        created(){
            systemProdConfig().then(res=>{
                if(res.errorCode==0){
                    this.prodConfig=res.data;

                    this.dis_level_list = res.data.dis_level_list
                    this.Dis_Level_arr = res.data.Dis_Level_arr

                    let tempArr = this.dis_level_list.map(item1=>{
                        return []
                    });
                    for(var i in tempArr){
                        tempArr[i] = this.Dis_Level_arr.map(item2=>{
                            return ''
                        })
                        //加一个自定义的
                        tempArr[i].push('')
                    }

                    this.$set(this,'distriboutor_config',tempArr);
                    //this.distriboutor_config = tempArr;

                    for(let item in this.prodConfig.Shop_Commision_Reward_Json.Distribute){
                        for(let i=0;i<this.dis_level_list.length;i++){
                            if(item==this.dis_level_list[i].Level_ID){
                                this.distriboutor_config[i]=this.prodConfig.Shop_Commision_Reward_Json.Distribute[item];
                            }
                        }
                    }

                    this.platForm_Income_Reward=res.data.Shop_Commision_Reward_Json.platForm_Income_Reward;
                    this.nobi_ratio=res.data.Shop_Commision_Reward_Json.noBi_Reward;
                    this.sha_Reward=res.data.Shop_Commision_Reward_Json.sha_Reward;
                    this.area_Proxy_Reward=res.data.Shop_Commision_Reward_Json.area_Proxy_Reward;
                    this.commission_ratio=res.data.Shop_Commision_Reward_Json.commission_Reward;
                }
            }).catch();
        }

        @Watch('specs', { deep: true,immediate:true })
        handleWatch(){
            // console.log('specs有变动')
            //
            // console.log(this.skuList.length,objTranslate(this.skusData))
            if(this.skuList.length>1){
                this.skusData=this.skuList
            }
            // console.log(objTranslate(this.skusData))

            this.createSkuData();
        }
        validateFn = {
            profit:(rule, value, callback) => {

                if (value === '') {
                    callback(new Error('请输入商品利润'));
                } else {
                    if (value>100||value<0) {
                        callback(new Error('商品利润在0~100之间'));
                    }
                    callback();
                }
            },
            pass:(rule, value, callback) => {

                if (value === '') {
                    callback(new Error('请输入现价'));
                } else {
                    if (Number(value) >= Number(this.ruleForm.Products_PriceY)) {
                        callback(new Error('现价应低于原价'));
                    }
                    callback();
                }
            },
            groupNumber:(rule, value, callback) => {

                if (this.ruleForm.pintuan_flag && !this.ruleForm.pintuan_people)callback(new Error('请输入拼团人数'))
                callback();

            },
            groupPrice:(rule, value, callback) => {

                if (this.ruleForm.pintuan_flag && !this.ruleForm.pintuan_pricex)callback(new Error('请输入拼团价格'))
                if (this.ruleForm.pintuan_flag && Number(this.ruleForm.pintuan_pricex)>Number(this.ruleForm.Products_PriceX))callback(new Error('拼团价格不能大于现价'))
                callback();

            },
            groupDate:(rule, value, callback) => {

                if (this.ruleForm.pintuan_flag && !this.ruleForm.pintuan_end_time)callback(new Error('请输入拼团截止时间'))
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
            committed:(rule, value, callback) => {
                if(this.Products_Promise.length>0){
                    for(let item of this.Products_Promise){
                        if(!item){
                            if(!this.ruleForm.freight)callback(new Error('商品承诺不能为空'))
                        }
                    }

                }
                callback();
            },
        }
        spec_val_list = []
        specs = [
            // {title:'颜色',vals:['黑色','白色','红色']},
            // {title:'尺码',vals:['X','M','L']},
            // {title:'面料',vals:['羊毛','牛毛','鹅毛']},
            // {title:'产地',vals:['美国','台湾','大陆','泰国']},
        ]

        skus = [];

        skuList = []

        skusData=[];

        //商品承诺
        Products_Promise=[''];
        committedIndex='';
        focusCommit(index){
            this.committedIndex=index;
        }
        committedAdd(){
            this.Products_Promise.push('');
        }
        committedDel(index){
            this.Products_Promise.splice(index,1);
        }
        @Watch('ruleForm.Products_Type', { deep: true,immediate:true })
        handle(){
            for(let item of this.prodConfig.prod_type_list){
                if(item.Type_ID===this.ruleForm.Products_Type){
                        this.specs=[];
                        for(let it of item.Attr_Name){
                           this.specs.push({title:it,vals:[]});
                        }
                }
            }
        }

        skuAdd(index){
        // .length++
            this.specs[index].vals.push('默认规格');
            //this.createSkuData();
        }
        skuDel(i,j){
            if(this.specs[i].vals.length<=1) return;
            this.specs[i].vals.splice(j,1);
            //this.createSkuData();
        }
        createSkuData(){
            let spec_arr = this.specs.map(item=>{
                return item.vals
            })
            // console.log(spec_arr)
            this.spec_val_list = spec_arr
            this.skus = calcDescartes(spec_arr)

            let name_list = this.skusData.map(sku=>{
                return sku.Attr_Value
            })



            let nameStr,idx;
            if(this.skus.length===1){
                if(_.isArray(this.skus[0])) {
                    let arr = [];
                    for (let item of this.skus[0]) {

                        idx=name_list.indexOf(item);
                        if(idx!=-1){
                            arr.push({
                                Attr_Value: item,
                                Attr_Price: this.skusData[idx].Attr_Price,
                                Property_count: this.skusData[idx].Property_count,
                                Supply_Price: this.skusData[idx].Supply_Price,
                                pt_pricex:this.skusData[idx].pt_pricex
                            })
                        }else{
                            arr.push({
                                Attr_Value: item,
                                Attr_Price: '',
                                Property_count: '',
                                Supply_Price: '',
                                pt_pricex:''
                            })
                        }

                    }
                    this.skuList = arr;
                }
            }else{
                this.skuList = this.skus.map(sku=>{

                    // if(_.isArray(sku)){
                    //
                    // }else{
                    //     nameStr = sku
                    // }
                    nameStr = sku.join('|')
                    //sku需要排序

                    idx=name_list.indexOf(nameStr)
                    if(idx!=-1){
                        return {...this.skusData[idx]}
                    }

                    return {
                        Attr_Value:nameStr,
                        Attr_Price:'',
                        Property_count:'',
                        Supply_Price:'',
                        pt_pricex:''
                    }
                });
            }


        }

        querySearchAsync(queryString, cb) {
            cb(this.queryArr);
        }
        queryArr=[];
        queryIndex(index){
            this.queryArr=[];
            for(let item of this.prodConfig.prod_type_list){
                if(item.Type_ID==this.ruleForm.Products_Type){
                    if(item.Attr_Values){
                        let arr=item.Attr_Values;
                        let titles=this.specs[index].title;
                        for(let it in item.Attr_Values){
                            if(it==titles){
                                let arrs=item.Attr_Values[it]
                                let myobj={}
                                for(let item of  arrs){
                                    myobj['value']=item;
                                    this.queryArr.push(myobj);
                                }
                            }
                        }

                    }

                }
            }
        }

        getRowsSpan(specsIndex){
            return getArrayMulite(this.spec_val_list,specsIndex);
        }

        allPrice=true;
        allType='';
        allValue='';
        changePrice(index){
            this.allValue='';
            this.allType=index;
            this.allPrice=false;
        }
        saveAll(){
            if(!this.allValue) return;
            if(this.allType=='price'){
                for(let item of this.skuList){
                    item.Attr_Price=this.allValue;
                }
            }else if(this.allType=='count'){
                for(let item of this.skuList){
                    item.Property_count=this.allValue;
                }
            }else if(this.allType=='pintuan'){
                for(let item of this.skuList){
                    item.pt_pricex=this.allValue;
                }
            }else{
                for(let item of this.skuList){
                    item.Supply_Price=this.allValue;
                }
            }
            this.allPrice=true;
        }
        delAll(){
            this.allPrice=true;
        }

        ruleForm =  {
            Products_Index: '',//商品排序
            Products_Name:'',//商品名称
            Products_Sales:'',//虚拟销量
            Products_PriceY:'',//原价
            Products_PriceX:'',//现价
            pintuan_people:'',//拼团人数
            pintuan_pricex:'',//拼团价格
            pintuan_end_time:'',//拼团时间
            Products_Profit:'',//商品利润
            Products_BriefDescription:'',//商品简介
            Products_Type: '',//商品类型
            Products_Weight:0,//商品重量
            otherAttributes:[],//其他属性
            Products_Count:'',//商品库存
            refund:'',//退货说明
            goods:'0',//运费
            pintuan_flag:false,//是否拼团
            content:'',//富文本
            orderType:'0',//订单类型
            freight:'0',//运费
            freightGu:'',//固定运费
            Products_IsPaysBalance:'',//是否使用余额支付
        }
        rules = {
            Products_Index: [
                {required: true,message: '请输入商品排序', trigger: 'blur' }
            ],
            Products_Name:[
                { required: true, message: '请输入商品名称', trigger: 'blur' }
            ],
            Products_Sales:[
                { required: true, message: '请输入虚拟销量', trigger: 'blur' },
                { type: 'number', message: '虚拟销量必须为数字值'}
            ],
            Products_PriceY:[
                { required: true, message: '请输入原价',trigger: 'blur' }
            ],
            Products_PriceX:[
                { validator:this.validateFn.pass, trigger: 'blur' }
            ],
            pintuan_people:[
                {validator:this.validateFn.groupNumber, trigger: 'blur' },
                { type: 'number', message: '拼团人数必须为数字值'}
            ],
            pintuan_pricex:[
                { validator:this.validateFn.groupPrice, trigger: 'blur' }
            ],
            pintuan_end_time:[
                { type: 'date', validator:this.validateFn.groupDate, trigger: 'change' }
            ],
            Products_Profit:[
              { required: true, validator:this.validateFn.profit, trigger: 'blur' }
            ],
            Products_BriefDescription:[
                { required: true, message: '请输入商品简介', trigger: 'blur' }
            ],
            Products_Type: [
                { required: true, message: '请选择商品类型', trigger: 'change' }
            ],
            Products_Weight:[
                { required: true, message: '请输入商品重量', trigger: 'blur' }
            ],
            Products_Count:[
                { required: true, message: '请输入商品库存', trigger: 'blur' }
            ],
            refund:[
                { required: true, message: '请选择退货类型', trigger: 'change' }
            ],
            goods:[
                { validator:this.validateFn.freightIs, trigger: 'change' }
            ],
            orderType:[
                { required: true, message: '请选择订单类型', trigger: 'change' }
            ],
            Products_Promise:[
                { validator:this.validateFn.committed, trigger: 'change' }
            ]
        }

        imgs = '';//展示图
        video = ''//视频
        thumb = []//主图
        cate_list = []
        cate_ids = ''

        removeThumbCall(file){
            let idx = this.thumb.indexOf(file.path);
            if(idx!=-1){
                this.thumb.splice(idx,1);
            }
        }

        upThumbSuccessCall(file){
            this.thumb.push(file.path);
        }

        removeImgsCall(file){
            this.imgs='';
        }

        upImgsSuccessCall(file){
            this.imgs=file.path;
        }

        removeVideoCall(file){
            this.video = ''
        }

        upVideoSuccessCall(file){
            this.video = file.path
        }
        fenxiaoshang=[];

        platForm_Income_Reward='';
        nobi_ratio="";
        area_Proxy_Reward="";
        sha_Reward="";
        commission_ratio="";
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if(this.ruleForm.orderType==0){
                        if(this.ruleForm.Products_Weight<=0){
                            return alert('实体订单商品重量大于0')
                        }
                    }
                    let productInfo={
                        Products_Index:this.ruleForm.Products_Index,//商品排序
                        Products_Name:this.ruleForm.Products_Name,//商品名称
                        Products_Category:this.cate_ids,//商品分类
                        Products_Sales:this.ruleForm.Products_Sales,//虚拟销量
                        Products_PriceY:this.ruleForm.Products_PriceY,//原价
                        Products_PriceX:this.ruleForm.Products_PriceX,//现价
                        pintuan_flag:this.ruleForm.pintuan_flag?'1':'0',//是否拼团
                        Products_Profit:this.ruleForm.Products_Profit,//产品利润
                        Products_BriefDescription:this.ruleForm.Products_BriefDescription,//产品简介
                        Products_Count:this.ruleForm.Products_Count,//库存
                        Products_Type:this.ruleForm.Products_Type,//商品类型id
                        Products_Weight:this.ruleForm.Products_Weight,//商品重量
                        Products_IsShippingFree:this.ruleForm.goods,//运费选择
                        prod_order_type:this.ruleForm.orderType,//订单类型
                        Products_Description:this.editorText,//富文本类型
                        Product_backup:this.ruleForm.refund,//退货id
                        platForm_Income_Reward:this.platForm_Income_Reward,
                        nobi_ratio:this.nobi_ratio,
                        area_Proxy_Reward:this.area_Proxy_Reward,
                        sha_Reward:this.sha_Reward,
                        commission_ratio:this.commission_ratio,
                    };
                    if(this.thumb.length<1){
                        alert('商品主图不能为空');
                        return ;
                    }else {
                        productInfo.Products_JSON=JSON.stringify({"ImgPath":this.thumb})
                    }
                    if(this.video){
                        productInfo.video_url=this.video;
                        productInfo.cover_url=this.imgs;
                    }
                    if(this.store_list.length>0){
                        let arr=[];
                        for(let item of this.store_list){
                            arr.push(item.Stores_ID);
                        }
                        if(arr.length>0){
                            productInfo.Products_Stores=JSON.stringify(arr);
                        }
                    }

                    for(let item of  this.ruleForm.otherAttributes){
                        if(item=='下架') productInfo.Products_SoldOut=1;
                        if(item=='新品')productInfo.Products_IsNew=1;
                        if(item=='热卖')productInfo.Products_IsHot=1;
                        if(item=='推荐')productInfo.Products_IsRecommend=1;
                    }
                    if(this.ruleForm.goods==0){
                        //如果是免运费的话
                        productInfo.Shipping_Free_Company=this.ruleForm.freight;
                    }
                    if(this.prodConfig.Payment_RmainderEnabled){
                        //如果可以设置余额支付
                        productInfo.Products_IsPaysBalance=this.ruleForm.Products_IsPaysBalance?'1':'0';
                    }
                    if(this.ruleForm.pintuan_flag){
                        //是拼团商品
                        //转化时间
                        var d = new Date(this.ruleForm.pintuan_end_time);
                        var date = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
                        productInfo.pintuan_people=this.ruleForm.pintuan_people;
                        productInfo.pintuan_pricex=this.ruleForm.pintuan_pricex;
                        productInfo.pintuan_end_time=date;
                    }
                    //商品规格
                    if(this.specs.length>0){
                        let attrs={};
                        for(let item of this.specs){
                            if(item.vals.length>0){
                                let ar=[];
                                for(let it of item.vals){
                                    ar.push(it);
                                }
                                attrs[item.title]=ar;
                            }
                        }
                        let arrM=this.skuList;
                        let skuList= objTranslate(arrM);
                        for(let mbx of skuList){
                            if(typeof mbx.Attr_Value=='object' ){

                            }else{
                                let splitArr=mbx.Attr_Value.split("|");
                                let objSku={};
                                for(let i=0;i<this.specs.length;i++){
                                    objSku[this.specs[i].title]=splitArr[i];
                                }
                                mbx.Attr_Value=objSku;
                            }
                        }
                        productInfo.prod_attrval=JSON.stringify({
                            'attrs':attrs,
                            'values':skuList
                        })
                    }
                    //分销商 价格
                    if(this.dis_level_list.length>0){
                        let disArr=this.dis_level_list;
                        let disObj={};
                        for(let dis=0;dis<disArr.length;dis++){
                            let arr=disArr[dis].Level_ID;
                            let arr2=this.distriboutor_config[dis];
                            disObj[arr]=arr2;
                        }
                        productInfo.Products_Distributes=JSON.stringify(disObj);
                    }

                    alert('submit!');
                    systemOperateProd(productInfo).then(res=>{
                        console.log(res,"sss")
                    }).catch(e=>{
                        console.log(e)
                    })
                } else {
                    alert('您还有未填写的商品');
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

        bindCateSuccessCall(dataType, type, path, tooltip, dataArr, pageEl, idx2,ext){

            let origin_cate_list = ext//获取所有的菜单数据，方便后面拼接。

            let child_arr = [];
            let cate_data = {}
            for(var cate of origin_cate_list){
                child_arr = [];

                for(var item of dataArr){
                    if(item.child)continue
                    for(var child of cate.child){
                        if(child.Category_ID === item.Category_ID){
                            child_arr.push(item.Category_ID)
                        }
                    }
                }

                if(child_arr.length>0){
                    cate_data[cate.Category_ID] = [...child_arr]
                }

            }

            //console.log(cate_data)

            this.cate_list = dataArr.map(cate=>{
                return {Category_Name:cate.Category_Name,Category_ID:cate.Category_ID}
            })

            // let ids = this.cate_list.map(cate=>{
            //     return cate.Category_ID
            // })

            this.cate_ids = JSON.stringify(cate_data)//ids.join('|')
            this.bindCateDialogShow = false
        }


        store_list = []
        bindStoreCancel(){
            this.dialogStoreShow = false
        }

        bindStoreSuccessCall(list, pageEl){
            this.store_list = list
            this.dialogStoreShow = false
        }
        settingCancel(){
            this.commission=false;
        }
        settingSuccessCall(){
            this.commission=false;
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
  position: relative;

  .setting{
    position: fixed;
    right: 46px;
    top: 460px;
    background-color: #428CF7;
    border-radius: 2px;
    font-size: 14px;
    color: #FFFFFF;
    padding: 15px 16px;
    width: 60px;
    height: 60px;
    z-index: 999;
    box-sizing: border-box;
    line-height:18px;
  }
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
      &.store_list{
        display: block;

      }
      .store_item{
        line-height: 36px;
        height: 36px;
        cursor: pointer;
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


/*  笛卡尔积样式*/
.specs_box{
  background-color: #f8f8f8;
  padding: 14px;
  margin-right: 20px;
}

.input-wrap{
  position: relative;
  &:hover{
    .imgDel{
      visibility: visible;
    }
  }
  /*删除图片样式*/
  .imgDel{
    visibility: hidden;
    position: absolute;
    top: -3px;
    right: -10px;
    font-size: 20px;
    height: 20px;
    line-height: 20px;
    cursor: pointer;
  }
}

  .divTd{
    text-align: left !important;
    font-size: 14px;
    color: #666666;
    .span{
      color: #428CF7;
      margin-right: 10px;
      cursor: pointer;
    }
    .spans{
      margin-left: 10px;
      cursor: pointer;
      color: #428CF7;
    }
  }
.el-icon-error:hover{
  color: red;
}
  .specs_row{
    margin-bottom: 10px;
  }

@border:#DBDBDB;
.setting{
  font-size: 14px;
  color: #666666;
  margin-left: 0px;
}
.commissionDiv{
  display: flex;
  align-items: center;
  height: 50px;
  align-items: center;
  border:1px solid @border;
  border-bottom: 0px;
}

.titles{
  width: 20%;
  text-align: center;
  line-height: 50px;
  height: 50px;
  border-right: 1px solid @border;
}
.rightTitle{
  width: 80%;
}
.msg{
  color: #999999;
}
.commissionLast{
  display: flex;
  align-items: center;
  text-align: center;
  border: 1px solid @border;
}
.aiHai{
  width: 80%;
  padding: 19px 29px 30px 21px;
  background-color: #FFFFFF;
  display: flex;
  border-left: 1px solid  @border;
  box-sizing: border-box;
  margin-left: -1px;
}
.fenxiaoshang{
  background-color: #F8F8F8;
  /*width: 320px;*/
  margin-right: 15px;
  .label{
    display: inline-block;
    min-width: 60px;
    margin-right: 6px;
    text-align: right;
  }
}
.fenTitle{
  font-size: 16px;
  color: #333333;
  height: 41px;
  line-height: 41px;
  text-align: center;
  border-bottom: 1px dotted #C0C0C0;
}

.sure{
  height: 38px;
  width: 100%;
  padding-top: 26px;
  .spans{
    width: 77px;
    height: 38px;
    display: block;
    line-height: 38px;
    text-align: center;
    font-size: 16px;
    color: #FFFFFF;
    background-color: #428CF7;
    line-height:34px;
    margin: 0 auto;
  }
}
</style>
