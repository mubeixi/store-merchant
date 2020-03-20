<template>
  <div class="addProduct">
    <div class="menuset">
        <span class="menusetText">发布商品</span>
    </div>

    <el-form size="small" :model="ruleForm" :rules="rules" ref="ruleForm" :inline-message="true" label-width="120px"   class="ruleForm">
      <el-alert
        v-if="textTitle"
        style="margin-bottom: 10px"
        :title="textTitle"
        :closable="false"
        type="success">
      </el-alert>
      <el-form-item label="商品排序" prop="Products_Index">
                <el-input v-model="ruleForm.Products_Index" :disabled="noEditField.Products_Index"  class="sortInput"></el-input>
                <span class="sortMsg">注：数字越大，越往前（必须大于0）</span>
      </el-form-item>
      <el-form-item label="商品名称" prop="Products_Name">
        <el-tooltip class="item" effect="light" :content="textTitle" placement="top-start" :disabled="!noEditField.Products_Name">
          <el-input v-model="ruleForm.Products_Name"  :disabled="noEditField.Products_Name"  class="nameInput"></el-input>
        </el-tooltip>
      </el-form-item>

      <el-form-item label="商品分类">
          <span class="classificationSpan" @click="bindCateDialogShow=true">选择分类</span>
      </el-form-item>
      <div class="group cate_list" style="margin-left: 120px;margin-bottom: 22px;" v-if="cate_list.length>0">
        <span class="cate_item" v-for="(cate,idx) in show_cate_list">{{cate.Category_Name}}</span>
      </div>
      <el-form-item label="销量" >
          <el-input v-model.number="ruleForm.Products_Sales" :disabled="noEditField.Products_Sales"  class="sortInput"></el-input>
          <span class="sortMsg">注：消费者看到的销量</span>
      </el-form-item>

      <el-form-item label="产品价格" >
        <el-form-item prop="Products_PriceY" style="display: inline-block;margin-bottom: 0px" >
          <el-tooltip class="item" effect="light" :content="textTitle" placement="top-start" :disabled="!noEditField.Products_PriceY">
            <el-input v-model="ruleForm.Products_PriceY"  :disabled="noEditField.Products_PriceY"  placeholder="原价:¥" class="sortInput"></el-input>
          </el-tooltip>
        </el-form-item>
        <el-form-item  prop="Products_PriceX" style="display: inline-block;margin-bottom: 0px">
          <el-tooltip class="item" effect="light" :content="textTitle" placement="top-start" :disabled="!noEditField.Products_PriceX">
            <el-input v-model="ruleForm.Products_PriceX"  :disabled="noEditField.Products_PriceX"  placeholder="现价:¥" class="sortInput" style="margin-left: 18px"></el-input>
          </el-tooltip>
        </el-form-item>
      </el-form-item>

      <el-form-item label="拼团" prop="type" style="margin-bottom: 10px">
        <el-tooltip class="item" effect="light" :content="textTitle" placement="top-start" :disabled="!noEditField.pintuan_flag">
          <el-checkbox v-model="ruleForm.pintuan_flag" :disabled="noEditField.pintuan_flag"  name="group">是否参与拼团</el-checkbox>
        </el-tooltip>
      </el-form-item>



      <div class="group" style="margin-left: 120px;margin-bottom: 22px;" v-if="ruleForm.pintuan_flag">
        <el-form-item label="拼团人数" prop="pintuan_people" style="margin-bottom: 0px">
          <el-tooltip class="item" effect="light" :content="textTitle" placement="top-start" :disabled="!noEditField.pintuan_people">
            <el-input v-model.number="ruleForm.pintuan_people" :disabled="noEditField.pintuan_people"   class="sortInput"></el-input>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="拼团价格" prop="pintuan_pricex"  style="margin-left: 43px;margin-bottom: 0px">
          <el-tooltip class="item" effect="light" :content="textTitle" placement="top-start" :disabled="!noEditField.pintuan_pricex">
            <el-input v-model="ruleForm.pintuan_pricex" :disabled="noEditField.pintuan_pricex"   class="sortInput"></el-input>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="截止时间" prop="pintuan_end_time" style="margin-left: 43px;margin-bottom: 0px">
          <el-tooltip class="item" effect="light" :content="textTitle" placement="top-start" :disabled="!noEditField.pintuan_end_time">
            <el-date-picker
              v-model="ruleForm.pintuan_end_time"
              :disabled="noEditField.pintuan_end_time"
              type="datetime"
              placeholder="选择日期时间"
              style="width: 200px" >
            </el-date-picker>
          </el-tooltip>
        </el-form-item>
      </div>

      <el-form-item label="商品利润" prop="Products_Profit">
        <el-input v-model="ruleForm.Products_Profit" :disabled="noEditField.Products_Profit"   class="sortInput sortInputs" ></el-input>
        <span class="sortMsg">注：佣金将从商品利润中取出一部分发放</span>
      </el-form-item>



      <el-dialog  title="预览素材" :visible.sync="preDialogInstance.show">
        <video width="100%" style="max-height: 500px" controls autoplay :src="domainFn(preDialogInstance.url)" v-if="preDialogInstance.type==='video'"></video>
        <img width="100%"  style="max-height: 500px" :src="domainFn(preDialogInstance.url)"  v-if="preDialogInstance.type==='image'" alt="">
      </el-dialog>

      <el-form-item label="商品主图"  class="relative">
        <div class="preview-thumb-box preview-box">
          <div class="preview-thumb-item preview-item" v-for="(img,idx) in thumb" :key="idx">
            <img class="img" :src="img" />
            <div class="actions thumb-actions">

              <div class="row">
                <span title="查看图片" class="icon __item-preview" @click="onPreviewFn(img)"><i class="el-icon-zoom-in"></i></span>
                <span title="删除图片" class="icon __item-delete" @click="doRemoveThumb(idx)"><i class="el-icon-delete"></i></span>
              </div>
              <div class="row">
                <span title="向右移动图片" class="icon __item-pre" v-if="idx!=0" @click="prevFn(img,idx)"><i class="el-icon-back"></i></span>
                <span title="向左移动图片" class="icon __item-next" v-if="idx!=(thumb.length-1)" @click="nextFn(img,idx)"><i class="el-icon-right"></i></span>
              </div>
            </div>
          </div>
        </div>
        <div class="js-finder-label" v-if="thumb.length<5" @click="openFinderByThumb">
          <i class="el-icon-plus" ></i>
        </div>
<!--        <upload-components-->
<!--          size="mini"-->
<!--          ref="thumb"-->
<!--          :limit="5"-->
<!--          tip="上传商品主图"-->
<!--          :onSuccess="upThumbSuccessCall"-->
<!--        />-->
      </el-form-item>

      <el-form-item label="主图视频及封面" v-if="prodConfig.is_upload_video==1">
        <div class="flex">
          <div class="relative">
            <div class="preview-thumb-box preview-box" v-if="video">
              <div class="preview-thumb-item preview-item" >
                <video class="img" :src="video" ></video>
                <div class="actions">
                  <span class="__item-preview" @click="onPreviewFn(video,'video')"><i class="el-icon-zoom-in"></i></span>
                  <span class="__item-delete" @click="video=''"><i class="el-icon-delete"></i></span>
                </div>
              </div>
            </div>
            <div class="js-finder-label" v-if="!video" @click="openFinderByVideo">
              <i class="el-icon-plus" ></i>
            </div>
<!--            <upload-components-->
<!--              type="video"-->
<!--              ref="video"-->
<!--              elName="video"-->
<!--              accept="video/*"-->
<!--              size="mini"-->
<!--              tip="上传主图视频"-->
<!--              :onSuccess="upVideoSuccessCall"-->
<!--            />-->
          </div>
          <div class="margin15-c relative">
            <div class="preview-thumb-box preview-box" v-if="imgs">
              <div class="preview-thumb-item preview-item" >
                <img class="img" :src="imgs" />
                <div class="actions">
                  <span class="__item-preview" @click="onPreviewFn(imgs)"><i class="el-icon-zoom-in"></i></span>
                  <span class="__item-delete" @click="imgs=''"><i class="el-icon-delete"></i></span>
                </div>
              </div>
            </div>
            <div class="js-finder-label" v-if="!imgs" @click="openFinderByVideoCover">
              <i class="el-icon-plus" ></i>
            </div>
<!--            <upload-components-->
<!--              ref="video_cover"-->
<!--              :limit="1"-->
<!--              size="mini"-->
<!--              tip="上传视频封面"-->
<!--              :onSuccess="upImgsSuccessCall"-->
<!--            />-->
          </div>
        </div>


      </el-form-item>

      <el-form-item label="商品简介">
        <el-tooltip class="item" effect="light" :content="textTitle" placement="top-start" :disabled="!noEditField.Products_BriefDescription">
          <el-input  maxlength="250" type="textarea"  :disabled="noEditField.Products_BriefDescription"   v-model="ruleForm.Products_BriefDescription" style="width: 600px;" :rows="4"></el-input>
        </el-tooltip>
      </el-form-item>

      <el-form-item label="商品类型" prop="Products_Type" title="请输入活动">
        <el-tooltip class="item" effect="light" :content="textTitle" placement="top-start" :disabled="!noEditField.Products_Type" >
          <el-select  v-model="ruleForm.Products_Type" placeholder="请选择类型" :disabled="noEditField.Products_Type"  style="width: 160px">
            <template v-for="(it,ind_con) of prodConfig.prod_type_list">
              <el-option :label="it.Type_Name" :value="it.Type_ID" ></el-option>
            </template>
          </el-select>
        </el-tooltip>
      </el-form-item>

      <el-form-item label="商品规格" v-if="ruleForm.Products_Type">
       <div class="specs_box">
         <div class="specs_row" v-for="(row,idx_row) in specs" :key="idx_row">
           <span class="label">{{row.title}}</span>
            <div class="specs-item-list">
              <div v-for="(val,idx_val) in row.vals" class="spec-item-box">
                <div class="input-wrap"   style="width: 110px;margin-left: 10px;display: inline-block;position: relative" >
                  <el-tooltip class="item" effect="light" :content="textTitle" placement="top-start" :disabled="!noEditField.Products_Type" >
                    <el-autocomplete
                      class="inline-input"
                      :fetch-suggestions="querySearchAsync"
                      v-model="specs[idx_row].vals[idx_val]"
                      :disabled="noEditField.Products_Type"
                      @focus="queryIndex(idx_row,specs[idx_row].vals[idx_val])"
                    ></el-autocomplete>
                  </el-tooltip>
                  <div class="imgDel" @click="skuDel(idx_row,idx_val)">
                    <i class="el-icon-error"></i>
                  </div>
                </div>
                <!--ref用来初始化-->
<!--                <upload-components-->
<!--                  v-if="idx_row==0&&skuImg"-->
<!--                  class="uploadThumb"-->
<!--                  :disabled="noEditField.Products_Type"-->
<!--                  :key="idx_val"-->
<!--                  ref="specPic"-->
<!--                  size="mini"-->
<!--                  @click.native="saveCurrentSpecItem(idx_val)"-->
<!--                  :onSuccess="upSpecPicSuccessCall"-->
<!--                />-->
                <template v-if="idx_row==0&&skuImg">
                  <div class="preview-spec-box preview-box" style="display: block;margin: 10px auto;" v-if="specs[0].imgs[idx_val]">
                    <div class="preview-thumb-item preview-item" style="display: block;margin: 10px auto;">
                      <img class="img" :src="specs[0].imgs[idx_val]" />
                      <div class="actions">
                        <span class="__item-preview" @click="onPreviewFn(specs[0].imgs[idx_val])"><i class="el-icon-zoom-in"></i></span>
                        <span class="__item-delete" @click="removeSpecPic(idx_val)"><i class="el-icon-delete"></i></span>
                      </div>
                    </div>
                  </div>
                  <div  style="display: block;margin: 10px auto;" class="js-finder-label" v-if="!specs[0].imgs[idx_val]" @click="openFinderBySpec(idx_val)">
                    <i class="el-icon-plus" ></i>
                  </div>
                </template>

              </div>

              <span class="margin15-c" style="cursor: pointer;color: #428CF7" @click="skuAdd(idx_row)">添加规格值</span><el-checkbox style="margin-left: 5px" v-if="idx_row==0" v-model="skuImg"  name="sku">添加规格图片</el-checkbox>
            </div>
         </div>
       </div>
      </el-form-item>

      <el-form-item label="商品参数" v-show="skus.length>0">
        <div class="sku_box">

          <table class="table" cellspacing="0" cellpadding="0" >
            <tr class="tr">
              <th class="th" v-for="(spec,idx) in specs">{{spec.title}}</th>
              <th class="th borderRight" >价格(元)</th>
              <th class="th borderRight" >库存</th>
              <th class="th borderRight" >成本价(元)</th>
              <th class="th borderRight" v-if="ruleForm.pintuan_flag" >拼团价</th>
            </tr>
            <template v-if="skus.length>1">
              <template v-for="(sku,idx) in skus">
                <tr class="tr">
                  <template v-for="(i,index) in specs.length">
                    <template v-if="idx%getRowsSpan(index)===0">
                      <td class="td" :rowspan="getRowsSpan(index,idx)">{{sku[index]}}</td>
                    </template>
                  </template>
                  <td class="td borderRight inputSku" ><el-tooltip class="item" effect="light" :content="textTitle" placement="top-start" :disabled="!noEditField.Products_Type" ><el-input  :disabled="noEditField.Products_Type"  style="width: 160px" v-if="skuList[idx]"  v-model="skuList[idx].Attr_Price"/></el-tooltip></td>
                  <td class="td borderRight inputSku" ><el-tooltip class="item" effect="light" :content="textTitle" placement="top-start" :disabled="!noEditField.Products_Type" ><el-input :disabled="noEditField.Products_Type"  style="width: 160px" v-if="skuList[idx]"  v-model="skuList[idx].Property_count"/></el-tooltip></td>
                  <td class="td borderRight inputSku" ><el-tooltip class="item" effect="light" :content="textTitle" placement="top-start" :disabled="!noEditField.Products_Type" ><el-input :disabled="noEditField.Products_Type" style="width: 160px" v-if="skuList[idx]"  v-model="skuList[idx].Supply_Price"/></el-tooltip></td>
                  <td class="td borderRight inputSku"  v-if="ruleForm.pintuan_flag"><el-tooltip class="item" effect="light" :content="textTitle" placement="top-start" :disabled="!noEditField.Products_Type" ><el-input :disabled="noEditField.Products_Type" style="width: 160px" v-if="skuList[idx]"  v-model="skuList[idx].pt_pricex"/></el-tooltip></td>
                </tr>
              </template>
            </template>
            <template v-if="skus.length==1">
                <tr class="tr"  v-if="specs.length>1">
                  <template v-for="(item,idx) in skus[0]">
                  <td class="td" >{{item}}</td>
                  </template>
                  <td class="td borderRight inputSku"><el-tooltip class="item" effect="light" :content="textTitle" placement="top-start" :disabled="!noEditField.Products_Type" ><el-input :disabled="noEditField.Products_Type"  style="width: 160px"  v-if="skuList[0]"  type="number" v-model="skuList[0].Attr_Price"/></el-tooltip></td>
                  <td class="td borderRight inputSku"><el-tooltip class="item" effect="light" :content="textTitle" placement="top-start" :disabled="!noEditField.Products_Type" ><el-input :disabled="noEditField.Products_Type" style="width: 160px" v-if="skuList[0]"  v-model="skuList[0].Property_count"/></el-tooltip></td>
                  <td class="td borderRight inputSku"><el-tooltip class="item" effect="light" :content="textTitle" placement="top-start" :disabled="!noEditField.Products_Type" ><el-input :disabled="noEditField.Products_Type"  style="width: 160px" v-if="skuList[0]"  v-model="skuList[0].Supply_Price"/></el-tooltip></td>
                  <td class="td borderRight inputSku" v-if="ruleForm.pintuan_flag"><el-tooltip class="item" effect="light" :content="textTitle" placement="top-start" :disabled="!noEditField.Products_Type" ><el-input style="width: 160px" :disabled="noEditField.Products_Type"  v-if="skuList[0]"  v-model="skuList[0].pt_pricex"/></el-tooltip></td>
                </tr>
              <template v-if="specs.length==1">
                <tr class="tr"  v-for="(item,idx) of skuList">
                    <td class="td" >{{item.Attr_Value}}</td>
                    <td class="td borderRight inputSku"><el-tooltip class="item" effect="light" :content="textTitle" placement="top-start" :disabled="!noEditField.Products_Type" ><el-input :disabled="noEditField.Products_Type"  style="width: 160px"   type="number" v-model="skuList[idx].Attr_Price"/></el-tooltip></td>
                    <td class="td borderRight inputSku"><el-tooltip class="item" effect="light" :content="textTitle" placement="top-start" :disabled="!noEditField.Products_Type" ><el-input :disabled="noEditField.Products_Type" style="width: 160px"  v-model="skuList[idx].Property_count"/></el-tooltip></td>
                    <td class="td borderRight inputSku"><el-tooltip class="item" effect="light" :content="textTitle" placement="top-start" :disabled="!noEditField.Products_Type" ><el-input :disabled="noEditField.Products_Type"  style="width: 160px"  v-model="skuList[idx].Supply_Price"/></el-tooltip></td>
                    <td class="td borderRight inputSku" v-if="ruleForm.pintuan_flag"><el-tooltip class="item" effect="light" :content="textTitle" placement="top-start" :disabled="!noEditField.Products_Type" ><el-input style="width: 160px" :disabled="noEditField.Products_Type"    v-model="skuList[idx].pt_pricex"/></el-tooltip></td>
                </tr>
              </template>
            </template>
            <tr class="tr">
               <td class="td divTd" colspan="9">
                 <span>批量设置：</span>
                 <template v-if="allPrice">
                   <span  class="span" @click="changePrice('price')">价格</span><span class="span" @click="changePrice('count')">库存</span><span class="span" @click="changePrice('supply')">成本价</span><span v-if="ruleForm.pintuan_flag" class="span" @click="changePrice('pintuan')">拼团价</span>
                 </template>
                 <template v-else="!allPrice">
                   <span ><el-input v-model="allValue"   style="width: 100px;"/><span class="spans" @click="saveAll">保存</span><span class="spans" @click="delAll">取消</span></span>
                 </template>
               </td>
            </tr>
          </table>
        </div>
      </el-form-item>

      <el-form-item label="商品承诺" >
        <div class="input-wrap"  style="width: 160px;display: inline-block;position: relative" :style="{marginLeft:index==0?'':'10px'}"  v-for="(item,index) of Products_Promise" :key="index">
          <el-input     v-model="Products_Promise[index]" :disabled="noEditField.Products_Promise" @focus="focusCommit(index)"/>
<!--          <img src="@/assets/img/productAdd/del.png" class="imgDel" @click="committedDel(index)">-->
              <div class="imgDel" @click="committedDel(index)">
                <i class="el-icon-error"></i>
              </div>
        </div>
        <span class="margin15-c" style="cursor: pointer;color: #428CF7" @click="committedAdd">添加承诺</span>
      </el-form-item>

      <el-form-item label="商品重量" prop="Products_Weight">
        <el-tooltip class="item" effect="light" :content="textTitle" placement="top-start" :disabled="!noEditField.Products_Weight" >
            <el-input v-model="ruleForm.Products_Weight"  :disabled="noEditField.Products_Weight"  class="sortInput" ></el-input> kg
        </el-tooltip>
      </el-form-item>


      <el-form-item label="运费计算" prop="goods">
        <el-radio-group v-model="ruleForm.goods">
<!--          <el-radio label="1" style="display: block;margin-bottom: 15px"  :disabled="noEditField.Products_IsShippingFree">-->
<!--            免运费-->
<!--              <el-select :disabled="noEditField.Products_IsShippingFree"   v-model="ruleForm.freight" placeholder="请选择类型"  style="width: 160px;margin-left: 37px;">-->
<!--                <template v-for="(prod,prodIn) of prodConfig.shipping_company_dropdown">-->
<!--                  <el-option  :label="prodConfig.shipping_company_dropdown[prodIn]" :value="prodIn"></el-option>-->
<!--                </template>-->
<!--              </el-select>-->
<!--          </el-radio>-->
          <el-radio  label="1" style="display: block;margin-bottom: 15px;height: 30px;line-height: 30px" >
            固定运费
            <template v-if="ruleForm.goods==1">
              <el-input   v-model="fix_fee"  class="sortInput" placeholder="运费金额：¥" style="width: 160px;margin-left: 23px;"></el-input>
              元
            </template>
          </el-radio>
          <el-radio   label="2" style="display: block;margin-bottom: 15px;height: 30px;line-height: 30px" >
            物流模板
            <template  v-if="ruleForm.goods==2&&yunfei.length>0">
              <el-select    v-model="shipping_temp" placeholder="请选择物流模板"  style="width: 160px;margin-left: 23px;">
                <template v-for="(prod,prodIn) of yunfei">
                  <el-option  :label="prod.Template_Name" :value="prod.Template_ID"></el-option>
                </template>
              </el-select>
            </template>
            <template v-else-if="ruleForm.goods==2" >
                <span style="margin-left: 23px;color: #606266 !important" >
                  无模板
                </span>
                <span style="color: #606266 !important;margin-right: 4px;margin-left: 4px" >|</span>
                <span  @click="addWuliu">
                  去添加 >
                </span>
            </template>
          </el-radio>
<!--          <el-radio  label="2" style="display: block;margin-bottom: 15px" >-->
<!--            固定运费-->
<!--            <el-input   v-model="ruleForm.freightGu"  class="sortInput" placeholder="运费金额：¥" style="width: 200px;margin-left: 23px;"></el-input>-->
<!--          </el-radio>-->
        </el-radio-group>
      </el-form-item>
      <el-form-item label="其他属性" prop="otherAttributes">
        <el-checkbox-group v-model="ruleForm.otherAttributes">
          <el-tooltip class="item" effect="light" :content="textTitle" placement="top-start" :disabled="!noEditField.Products_SoldOut" >
            <el-checkbox  label="下架" name="otherAttributes" :disabled="noEditField.Products_SoldOut"></el-checkbox>
          </el-tooltip>
          <el-tooltip class="item" effect="light" :content="textTitle" placement="top-start" :disabled="!noEditField.Products_IsNew" >
            <el-checkbox  label="新品" name="otherAttributes" :disabled="noEditField.Products_IsNew"></el-checkbox>
          </el-tooltip>
          <el-tooltip class="item" effect="light" :content="textTitle" placement="top-start" :disabled="!noEditField.Products_IsHot" >
            <el-checkbox  label="热卖" name="otherAttributes" :disabled="noEditField.Products_IsHot"></el-checkbox>
          </el-tooltip>
          <el-tooltip class="item" effect="light" :content="textTitle" placement="top-start" :disabled="!noEditField.Products_IsRecommend" >
            <el-checkbox  label="推荐" name="otherAttributes" :disabled="noEditField.Products_IsRecommend"></el-checkbox>
          </el-tooltip>
        </el-checkbox-group>
      </el-form-item>
<!--      <el-form-item label="关联门店" >-->
<!--        <span class="classificationSpan" @click="dialogStoreShow=true" >选择门店</span>-->
<!--      </el-form-item>-->
<!--      <div class="group store_list" style="margin-left: 120px;margin-bottom: 22px;" v-if="store_list.length>0">-->
<!--        <div class="store_item" v-for="(store,idx) in store_list">{{store.Stores_Name}}</div>-->
<!--      </div>-->
      <el-form-item label="特殊属性"  >
        <el-checkbox-group v-if="prodConfig.Payment_RmainderEnabled==1"  :disabled="noEditField.Products_IsPaysBalance" v-model="ruleForm.Products_IsPaysBalance">
          <el-tooltip class="item" effect="light" :content="textTitle" placement="top-start" :disabled="!noEditField.Products_IsPaysBalance" >
            <el-checkbox label="使用余额支付" value="1" name="Products_IsPaysBalance"></el-checkbox>
          </el-tooltip>
        </el-checkbox-group>
        <el-checkbox-group  v-model="ruleForm.prod_limit" style="display: flex">
          <el-checkbox label="开启限购" value="2" name="prod_limit"></el-checkbox>
          <el-form-item label="全部会员" style="margin-left: -30px">
              <el-select  sizi="mini"  placeholder="请选择"  v-model="vipType"  style="width: 100px">
                <template v-for="(shop,shopIn) in prodConfig.prod_limit_type">
                  <el-option :label="shop" :value="shopIn"></el-option>
                </template>
              </el-select>
          </el-form-item>
          <el-input-number  v-model="vipNum" :min="1"  label="件" sizi="mini" style="width: 120px;margin-left: 10px"></el-input-number>
          <div style="font-size: 14px;margin-left: 10px">件</div>
        </el-checkbox-group>
      </el-form-item>

      <el-form-item label="赠送优惠券" prop="type" style="margin-bottom: 30px">
        <div style="display: flex;align-items: center">
          <template v-for="(item,index) of productData">
            <span  class="lst" >
              {{item.title}}
               <div class="imgDel" @click="delCoupon(item.id)">
                  <i class="el-icon-error"></i>
                </div>
            </span>

          </template>
          <span @click="selectCoupon"  class="lst-q">选择优惠券</span>
          <span class="sortMsg">注：订单支付成功后发放</span>
        </div>
      </el-form-item>

      <el-form-item label="订单类型" prop="orderType" >
        <el-radio-group v-model="ruleForm.orderType" :disabled="noEditField.prod_order_type" @change="changeRadio">
          <el-radio label="0" style="display: block;margin-bottom: 15px" >实物订单  <span class="font12">( 买家下单 -> 买家付款 -> 商家发货 -> 买家收货 -> 订单完成 )</span> </el-radio>
          <el-radio label="1" style="display: block;margin-bottom: 15px" >虚拟订单  <span class="font12">( 买家下单 -> 买家付款 -> 系统发送消费券码到买家手机 -> 商家认证消费 -> 订单完成 )</span></el-radio>
          <el-radio label="2"  style="display: block;margin-bottom: 15px" ><span>其他  <span class="font12">( 买家下单 -> 买家付款 -> 订单完成 ) <el-button type="primary"  @click="clickRadio" v-if="!noEditField.prod_order_type" sizi="mini">设置</el-button></span></span> </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="商品库存" prop="Products_Count">
        <el-input  v-model="ruleForm.Products_Count" :disabled="noEditField.Products_Count"  class="sortInput"></el-input>
        <span class="sortMsg">注:若不限则填写10000</span>
      </el-form-item>
      <el-form-item label="退货损坏说明">
        <el-select  v-model="ruleForm.refund" placeholder="请选择"  :disabled="noEditField.Product_backup"  style="width: 160px">
          <template v-for="(shop,shopIn) in prodConfig.shop_damage">
            <el-option :label="shop.Damage_Name" :value="shop.Damage_ID"></el-option>
          </template>
        </el-select>
      </el-form-item>
      <el-form-item label="商品详情">
        <div style="padding-right: 200px">
          <wzw-editor ref="richtext" :content.sync="editorText"    @on-content-change="onContentChange"></wzw-editor>
<!--          <kind-editor id="container" height="400px" width="800px" :content.sync="editorText"-->
<!--                      :afterChange="afterChange()"-->
<!--                      :loadStyleMode="false"-->
<!--                      @on-content-change="onContentChange" />-->
        </div>
      </el-form-item>
      <div style="height: 80px;width: 100%;background-color: #ffffff"></div>
    </el-form>

    <div class="bottomFixed">
      <el-button size="small" type="primary" :loading="isLoading" @click="submitForm('ruleForm')">提交保存</el-button>
      <el-button size="small" @click="goProduct">返回</el-button>
    </div>
    <bind-cate-components
      :multiple="true"
      @cancel="bindCateCancel"
      :strictly="false"
      mode="productAdd"
      :has.sync="cate_list"
      :onSuccess="bindCateSuccessCall"
      :pageEl="pageEl"
      :show="bindCateDialogShow"/>
<!--    <bind-store-component-->
<!--      @cancel="bindStoreCancel"-->
<!--      @success="bindStoreSuccessCall"-->
<!--      :pageEl="pageEl"-->
<!--      :has="store_list"-->
<!--      :show="dialogStoreShow"-->
<!--    />-->
    <el-dialog
      title="佣金设置"
      width="90%"
      @close="settingCancel"
      append-to-body
      :visible.sync="commission"
      class="setting"
    >

      <el-form :model="ruleForm" :rules="rules" size="small" ref="ruleForm" label-width="0px" class="ruleForm">
        <div class="commissionDiv">
          <div class="titles">
            发放比例
          </div>
          <div class="rightTitle">
            <el-form-item label="" prop="sort" style="margin-bottom: 0px;">
              <el-input   v-model="platForm_Income_Reward" style="width: 80px;margin-left: 19px;"></el-input>
              % <span class="msg">(发放金额所占网站利润百分比；小于100%大于0%)0</span>
            </el-form-item>
          </div>
        </div>
        <div class="commissionDiv">
          <div class="titles">
            爵位奖励比例
          </div>
          <div class="rightTitle">
            <el-form-item label="" prop="sort" style="margin-bottom: 0px;">
              <el-input   v-model="nobi_ratio" style="width: 80px;margin-left: 19px;"></el-input>
              % <span class="msg">(按照团队最多9级来发放级别差奖励，当下级有和自己同级别身份的就不再发放)</span>
            </el-form-item>
          </div>
        </div>
        <div class="commissionDiv">
          <div class="titles">
            区域代理比例
          </div>
          <div class="rightTitle">
            <el-form-item label="" prop="sort" style="margin-bottom: 0px;">
              <el-input    v-model="area_Proxy_Reward" style="width: 80px;margin-left: 19px;"></el-input>
              % <span class="msg">(按照消费者收货地址所在地发放区域代理奖励)</span>
            </el-form-item>
          </div>
        </div>
        <div class="commissionDiv">
          <div class="titles">
            股东佣金比例
          </div>
          <div class="rightTitle">
            <el-form-item label="" prop="sort" style="margin-bottom: 0px;">
              <el-input   v-model="sha_Reward" style="width: 80px;margin-left: 19px;"></el-input>
              % <span class="msg">(按照整个商城利润来对每个股东平均进行发放)</span>
            </el-form-item>
          </div>
        </div>
        <div class="commissionDiv">
          <div class="titles">
            分销佣金比例
          </div>
          <div class="rightTitle">
            <el-form-item label="" prop="sort" style="margin-bottom: 0px;">
              <el-input   v-model="commission_ratio" style="width: 80px;margin-left: 19px;"></el-input>
              % <span class="msg"><block v-if="self_commi=='2'&&parent_commi=='2'">(此项设置无效)</block><block v-else>(按照下方设置对各个身份、各个等级的分销商发放奖励)</block></span>
            </el-form-item>
          </div>
        </div>
        <div class="commissionDiv">
          <div class="titles">
            管理佣金比例
          </div>
          <div class="rightTitle">
            <el-form-item label="" prop="sort" style="margin-bottom: 0px;">
              <el-input   v-model="manage_Reward" style="width: 80px;margin-left: 19px;"></el-input>
              % <span class="msg"><block v-if="manage_commi=='2'">(此项设置无效)</block><block v-else>(在分销等级发放之外额外发放，当下级有和自己同级别身份就不再发放)</block></span>
            </el-form-item>
          </div>
        </div>
        <div class="commissionDiv">
          <div class="titles">
            管理佣金发放模式
          </div>
          <div class="rightTitle">
            <el-form-item label="" prop="sort" style="margin-bottom: 0px;margin-left: 19px">
              <el-radio-group style="display: flex;align-items: center;padding-top: 20px;" v-model="manage_commi" >
                <el-radio label="1" style="display: block;margin-bottom: 15px" >按百分比发放</el-radio>
                <el-radio label="2" style="display: block;margin-bottom: 15px" >按固定金额发放</el-radio>
              </el-radio-group>
            </el-form-item>
          </div>
        </div>
        <div class="commissionDiv">
          <div class="titles">
            上级分销佣金发放模式
          </div>
          <div class="rightTitle">
            <el-form-item label="" prop="sort" style="margin-bottom: 0px;margin-left: 19px">
              <el-radio-group style="display: flex;align-items: center;padding-top: 20px;" v-model="parent_commi" >
                <el-radio label="1" style="display: block;margin-bottom: 15px" >按百分比发放</el-radio>
                <el-radio label="2" style="display: block;margin-bottom: 15px" >按固定金额发放</el-radio>
               </el-radio-group>
            </el-form-item>
          </div>
        </div>
        <div class="commissionDiv"  v-if="prodConfig.Dis_Self_Bonus==1">
          <div class="titles">
            自销佣金发放模式
          </div>
          <div class="rightTitle">
            <el-form-item label="" prop="sort" style="margin-bottom: 0px;margin-left: 19px">
              <el-radio-group style="display: flex;align-items: center;padding-top: 20px;" v-model="self_commi">
                <el-radio label="1" style="display: block;margin-bottom: 15px" >按百分比发放</el-radio>
                <el-radio label="2" style="display: block;margin-bottom: 15px" >按固定金额发放</el-radio>
              </el-radio-group>
            </el-form-item>
          </div>
        </div>
        <div class="commissionLast">
          <div class="titles" style="width: 15%;">
            佣金返利 (全部统一)
          </div>
          <div class="aiHai">
            <div class="fenxiaoshang" v-for="(fen,fenIndex) of dis_level_list" :key="fenIndex">
              <div class="fenTitle">{{fen.Level_Name}}</div>
              <div class="paddingAll" v-if="distriboutor_config[fenIndex]">
                <el-form-item label="" prop="sort"  class="padding15-t marginBootom"  v-for="(dis,disIndex) of Dis_Level_arr" :key="disIndex">
                  <span class="label">{{dis}}</span>
                  <el-input   style="width: 70px" v-model="distriboutor_config[fenIndex][disIndex]"></el-input>
                  <block v-if="parent_commi=='2'"><span style="margin-left: 10px">元</span></block>
                  <block v-else>% <span class="msg">(佣金比例百分比)</span></block>
                </el-form-item>
                <el-form-item label="" prop="sort"  class="padding15-t marginBootom">
                  <span class="label">管理</span>
                  <!--手动加了一个-->
                  <el-input   style="width: 70px" v-model="distriboutor_config[fenIndex][110]"></el-input>
                  <block v-if="manage_commi=='2'"><span style="margin-left: 10px">元</span></block>
                  <block v-else>% <span class="msg">(佣金比例百分比)</span></block>
                </el-form-item>
                <el-form-item label="" prop="sort"  class="padding15-t marginBootom"  v-if="prodConfig.Dis_Self_Bonus==1">
                  <span class="label">自销</span>
                  <!--手动加了一个-->
                  <el-input   style="width: 70px" v-model="distriboutor_config[fenIndex][prodConfig.Dis_Level]"></el-input>
                  <block v-if="self_commi=='2'"><span style="margin-left: 10px">元</span></block>
                  <block v-else>% <span class="msg">(佣金比例百分比)</span></block>
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
    <el-dialog
      title="卡密设置"
      width="90%"
      @close="cardCancel"
      append-to-body
      :visible.sync="isShow"
      class="setting"
    >
        <div class="cardTitle">
              <div class="cardTitle" style="margin-right: 10px">
                卡号： <el-input  v-model="CardIdSelect"  class="sortInput" style="width: 100px"></el-input>
              </div>
              <div class="cardTitle" style="margin-right: 10px">
                栏目：
                <el-select  v-model="CardTypeSelect" placeholder="请选择类型"  style="width: 130px">
                  <template v-for="(shop,shopIn) in CardType">
                    <el-option :label="shop.Type_Name" :value="shop.Type_Id"></el-option>
                  </template>
                </el-select>
              </div>
              <el-button  type="primary" @click="searchCard">搜索</el-button>
        </div>
        <el-table
          ref="multipleTable"
          :data="CardList"
          tooltip-effect="dark"
          style="width: 100%"
          @row-click="handleRow"
          @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            label="#"
            width="55">
          </el-table-column>
          <el-table-column
            label="虚拟卡号"
            prop="Card_Name"
            width="120">
          </el-table-column>
          <el-table-column
            prop="Card_Password"
            label="密码"
            width="120">
          </el-table-column>
          <el-table-column
            prop="Card_CreateTime"
            label="添加时间"
            show-overflow-tooltip>
          </el-table-column>
        </el-table>
        <el-button  type="primary" style="margin-top: 10px" @click="sureCard">确定</el-button>
    </el-dialog>
    <div class="setting ponint" @click="commission=true">
      佣金设置
    </div>

    <el-dialog class="myProduct" title="选择优惠券" :visible.sync="settingShow" width="40%" >
      <fun-table
        style="height: 400px;overflow: auto"
        ref="funTableComp"
        vkey="id"
        :has="selectValue"
        :showSave=true
        :columns="dataTableOpt.columns"
        :dataList="dataTableOpt.dataList"
        :act="dataTableOpt.act"
        :_totalCount="dataTableOpt.totalCount"
        :_pageSize="dataTableOpt.pageSize"
        :is_paginate="dataTableOpt.is_paginate"
        :formSize="'small'"
        :isRow="false"
        @closeDialog="closeDialog"
        @handleSizeChange="handleSizeChange"
        @currentChange="currentChanges"
        @selectVal="selectVal"
        @submit="submit"
        @reset="reset"
      >
      </fun-table>
            <span slot="footer" class="dialog-footer">
                  <el-button @click="closeDialog">取 消</el-button>
                  <el-button type="primary" @click="saveCoupon">确 定</el-button>
            </span>
    </el-dialog>

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
    import BindStoreComponent from "@/components/comm/BindStoreComponent.vue";
    import SettingComponent from "@/components/comm/SettingComponent.vue";
    // import KindEditor from "@/components/comm/kindeditor.vue"
    import WzwEditor from "../components/editor/WzwEditor.vue";

    import {
        FUNFinder
    } from '../components/editor/ckeditt-resource/FUNFinder';

    import {
        getProductCategory,
        getStoreList,
        systemProdConfig,
        systemOperateProd,
        systemProdDetail,
        virtualCardType,
        virtualCardList,
        getShippingTemplate,
        getGivingCoupons
    } from '@/common/fetch'
    import _ from 'underscore';
    import {
        calcDescartes,
        objTranslate,
        plainArray,
        getArrayMulite,
        createTmplArray,
        findArrayIdx,
        domain,
        emptyObject,
        emptyValue,
        formatRichTextByKindEditor
    } from '@/common/utils';
    import {fun} from '@/common';

    @Component({
        mixins:[],
        components: {
            BindStoreComponent,
            SettingComponent,
            WzwEditor,

            // KindEditor,
            UploadComponents,BindCateComponents
        },
        watch:{
            skuImg:{
                handler(val){
                    if(val){
                        //创建数组组
                        if(emptyValue(this.specs[0].imgs)){
                            this.$set(this.specs[0],'imgs',[])
                        }
                    }
                }
            }
        }
    })
    export default class AddProduct extends Vue {

        delCoupon(id){
            let arr=[]
            for(let i=0;i<this.selectValue.length;i++){
                if(this.selectValue[i]==id){
                    this.selectValue.splice(i,1)
                    console.log(this.selectValue,"sss")
                    for(let item of this.productData){
                        if(item.id!=id){
                            arr.push(item)
                        }
                    }
                    this.productData=arr
                }
            }
        }

        plainArrays = (arr,key,newArr)=>{
            let that=this
            if(!arr || !key)return false;

            for(var item of arr){
                let tempObj = objTranslate(item)
                if(tempObj.hasOwnProperty(key)){
                    tempObj[key] = 1
                }
                newArr.push(tempObj)

                if(item && item[key] && _.isArray(item[key])){
                    that.plainArrays(item[key],key,newArr);
                }

            }

        }



        settingShow=false
        closeDialog(){
            this.settingShow=false
        }
        selectCoupon(){
            this.settingShow=true
            this.getProduct()
        }
        saveCoupon(){
            this.selectValue=[]
            this.productData=[]

            for(let item of this.val){
                this.productData.push(item)
                if(this.selectValue.indexOf(item.id)==-1){
                    this.selectValue.push(item.id)
                    //this.productData.push(item)
                }
            }
            for(let it of  this.vals){
                for(let i=0;i<this.selectValue.length;i++){
                    if(this.selectValue[i]==it.id){
                        this.selectValue.splice(i,1)
                        //this.productData.splice(i,1)
                    }
                }
            }
            this.settingShow=false
        }
        dataTableOpt = {
            act : 'get_giving_coupons',
            dataList:[],
            page:1,
            totalCount:100,
            pageSize:9999,
            is_paginate:false,//是否显示分页 默认显示
            columns : [
                {
                    prop: "id",
                    label: "优惠券ID",
                    align:'center',
                    search: false //不需要搜索ID,所以都不需要了
                },
                {
                    prop: "title",
                    label: "优惠券名称",
                    align:'center',
                    search: false //不需要搜索ID,所以都不需要了
                }

            ]
        }

        //重置
        reset(){
            for(let it in this.dataTableOpt.columns){
                this.dataTableOpt.columns[it].value=''
            }
            this.selectValue=[]
            this.getProduct()
        }
        //搜索
        submit(){
            this.getProduct()
        }
        //一页多少行
        handleSizeChange(val){
            this.dataTableOpt.pageSize=val
            this.getProduct()
        }
        //当前页数
        currentChanges(val){
            this.dataTableOpt.page=val
            this.getProduct()
        }
        getProduct(){
            let id = this.$route.query.prod_id;
            let data={
                pageSize: this.dataTableOpt.pageSize,
                page:this.dataTableOpt.page
            }
            // if(id){
            //     data.prod_id=id
            // }else{
            //     data.prod_id=-1
            // }
            getGivingCoupons(data).then(res=>{
                if(res.errorCode==0){
                    this.dataTableOpt.dataList=res.data
                    this.dataTableOpt.totalCount=res.totalCount
                }
            })
        }
        selectValue=[]
        productData=[]
        val=[]
        vals=[]
        //获取选中数据
        selectVal(val,vals){
            console.log(val,vals,"sssss1111")
            this.val=val
            this.vals=vals
        }

        addWuliu(){
            window.location.href=window.parent.location.href+'shop/shipping_template_add.php';
        }

        goProduct(){
            this.$router.push({
                name:'ProductList'
            })
        }

        domainFn(url){
            return domain(url)
        }
        fix_fee=0
        shipping_temp=''
        self_commi='1'
        parent_commi='1'
        manage_commi='1'
        manage_Reward=''
        vipType='1'
        vipNum=0
        pageEl = this
        bindCateDialogShow = false
        dialogStoreShow = false
        commission=false
        editorText =  '' // 双向同步的变量
        editorTextCopy =  ''  // content-change 事件回掉改变的对象
        addText="立即添加"
        prodConfig={
            prod_type_list:[],
            shipping_company_dropdown:{},
            Shop_Commision_Reward_Json:{},
            Dis_Level:''
        }
        distriboutor_config = []
        Dis_Level_arr = []
        dis_level_list = []
        initialPro=[]
        initialSku=[]
        CardList=[]
        CardType=[]
        isShow=false
        skuImg=false
        isLoading=false


        imgs = '';//展示图
        openFinderByVideoCover(){
            FUNFinder.open({options:{limit:1,allow:['image']},callFn:{choose:this.upImgsSuccessCall}});
        }

        video = ''//视频
        openFinderByVideo(){
            FUNFinder.open({options:{limit:1,allow:['media']},callFn:{chooseMedia:this.upVideoSuccessCall}});
        }

        thumb = []//主图
        openFinderByThumb(){
            if(this.thumb.length>=5){
                fun.error({msg:'最多上传五张缩略图'})
                return
            }
            FUNFinder.open({options:{limit:5-this.thumb.length,allow:['image']},callFn:{choose:this.upThumbSuccessCall}});
        }

        /**
         * 往前移动一个位置
         * @param url
         * @param idx
         */
        prevFn(url,idx){
            let tempUlr = this.thumb[idx-1]
            this.$set(this.thumb,idx-1,url)
            this.$set(this.thumb,idx,tempUlr)
        }

        /**
         * 往后移动一个位置
         * @param url
         * @param idx
         */
        nextFn(url,idx){
            let tempUlr = this.thumb[idx+1]
            this.$set(this.thumb,idx+1,url)
            this.$set(this.thumb,idx,tempUlr)
        }
        onPreviewFn(url,type='image'){
            this.preDialogInstance.url = url
            this.preDialogInstance.type = type
            this.preDialogInstance.show = true
        }


        doRemoveThumb(idx){
            this.thumb.splice(idx,1)
        }

        preDialogInstance = {
            show:false,
            url:'',
            type:'image'
        }
        yunfei=[]
        show_cate_list = []
        cate_list = []
        cate_ids = ''
        fenxiaoshang=[]
        platForm_Income_Reward=''
        nobi_ratio=""
        area_Proxy_Reward=""
        sha_Reward=""
        commission_ratio=""
        store_list = []
        store_id_list = []
        multipleSelection=[]
        currentSpecItemIdx = null //当前激活的规格可选值索引，从0开始
        noEditField=[];//不可编辑
        textTitle='';

        spec_val_list = []
        specs = []
        removeSpecPic(idx){
            //console.log(idx)
            this.$set(this.specs[0].imgs,idx,'')
            // [idx] = ''
        }

        skus = []
        skuList = []
        skusData=[]
        //商品承诺
        Products_Promise=['']
        committedIndex=''
        CardTypeSelect=''
        CardIdSelect=''
        queryArr=[]
        allPrice=true
        allType=''
        allValue=''

        validateFn = {
            // classification:(rule, value, callback) => {
            //     console.log(this.cate_ids,value,"ss")
            //     if (this.cate_ids === ''){
            //         callback(new Error('请选择商品分类'));
            //     }else{
            //         callback();
            //     }
            //
            // },
            ProductsType:(rule, value, callback) => {
                if (this.ruleForm.Products_Type === ''){
                    callback(new Error('请选择商品类型'));
                }else{
                    callback();
                }

            },
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
            }
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
            goods:'1',//运费
            pintuan_flag:false,//是否拼团
            content:'',//富文本
            orderType:'0',//订单类型
            freight:'0',//运费
            freightGu:'',//固定运费
            Products_IsPaysBalance:false,//是否使用余额支付
            prod_limit:false,//限购
        }
        rules = {
            Products_Index: [
                {required: true,message: '请输入商品排序', trigger: 'blur' }
            ],
            Products_Name:[
                { required: true, message: '请输入商品名称', trigger: 'blur' }
            ],
            // Products_Sales:[
            //     { required: true, message: '请输入虚拟销量', trigger: 'blur' },
            //     { type: 'number', message: '虚拟销量必须为数字值'}
            // ],
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
            Products_Type: [
                { validator:this.validateFn.ProductsType,trigger: 'change' }
            ],
            Products_Weight:[
                { required: true, message: '请输入商品重量', trigger: 'blur' }
            ],
            Products_Count:[
                { required: true, message: '请输入商品库存', trigger: 'blur' }
            ],
            goods:[
                { validator:this.validateFn.freightIs, trigger: 'change' }
            ],
            orderType:[
                { required: true, message: '请选择订单类型', trigger: 'change' }
            ],
            // classification:[
            //     { validator:this.validateFn.classification, trigger: 'change' }
            // ]
        }

        openFinderBySpec(idx){
            if(this.noEditField.Products_Type){
                fun.error({msg:'该类别不允许修改图片'})
                return;
            }
            this.currentSpecItemIdx = idx
            FUNFinder.open({options:{limit:1,allow:['image']},callFn:{choose:this.upSpecPicSuccessCall}});
        }
        saveCurrentSpecItem(idx){
            this.currentSpecItemIdx = idx
        }
        upSpecPicSuccessCall(url_list){
            let url = url_list[0]
            this.$set(this.specs[0].imgs,this.currentSpecItemIdx,url)
            //this.specs[0].imgs[this.currentSpecItemIdx] = url

        }
        onContentChange2 (val) {
            // console.log(val)
            this.editorText = val
        }
        onContentChange(val) {
            // console.log(val)
            this.editorText = val
        }
        afterChange () {
        }
        handleRow(row, column, event) {
            this.$refs.multipleTable.toggleRowSelection(row);
        }
        focusCommit(index){
            this.committedIndex=index;
        }
        committedAdd(){
            if(this.noEditField.Products_Promise) return;
            this.Products_Promise.push('');
        }
        committedDel(index){
            if(this.noEditField.Products_Promise) return;
            this.Products_Promise.splice(index,1);
        }
        skuAdd(index){
            if(this.noEditField.Products_Type) return
            this.specs[index].vals.push('');
        }
        skuDel(i,j){
            if(this.noEditField.Products_Type) return
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
            //就是只有一行的时候
            if(this.skus.length===1){
                if(this.specs.length>1){
                    if(_.isArray(this.skus[0])) {
                        let nameStr = this.skus[0].join('|')
                        let idx= name_list.indexOf(nameStr)
                        let obj = null;
                        if(idx!=-1){
                            obj = {...this.skusData[idx]}
                        }else{
                            obj ={
                                Attr_Value: nameStr,
                                Attr_Price:'',
                                Property_count:'',
                                Supply_Price:'',
                                pt_pricex:''
                            }
                        }

                        this.skuList = [obj];
                    }
                }else{
                    if(_.isArray(this.skus[0])) {

                        this.skuList = []
                        for(let item of this.skus[0]){
                            let nameStr = item;
                            let idx= name_list.indexOf(nameStr)
                            let obj = null;
                            if(idx!=-1){
                                obj = {...this.skusData[idx]}
                            }else{
                                obj ={
                                    Attr_Value: nameStr,
                                    Attr_Price:'',
                                    Property_count:'',
                                    Supply_Price:'',
                                    pt_pricex:''
                                }
                            }

                            this.skuList.push(obj);
                        }

                    }
                }

            }else{
                this.skuList = this.skus.map(sku=>{
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

            // console.log("初始化规格")
            for(let item of this.skuList){
                for(let it of this.initialSku){
                    if(item.Attr_Value==it.Attr_Value){
                        item.Supply_Price=it.Supply_Price;
                        item.Attr_Price=it.Attr_Price;
                        item.pt_pricex=it.pt_pricex;
                        item.Property_count=it.Property_count;
                    }
                }
            }


        }
        handleSelectionChange(val){
            this.multipleSelection = val;
        }
        changeRadio(){
            // if(this.ruleForm.orderType==2){
            //     this.isShow=true;
            // }
        }
        clickRadio(){
            this.isShow=true;
        }
        searchCard(){
            let data={
                card_name:this.CardIdSelect,
                type_id:this.CardTypeSelect
            }
            let id = this.$route.query.prod_id;
            if(id){
                data.prod_id=id;
            }
            virtualCardList(data).then(res=>{
                this.CardList=res.data;
                for(let item of this.CardList){
                    if(item.Products_Relation_ID==id){
                        this.multipleSelection.push(item)
                    }
                }
            })
        }
        sureCard(){
                this.isShow=false
        }
        cardCancel(){
                this.isShow=false
        }
        querySearchAsync(queryString, cb) {
            cb(this.queryArr);
        }
        queryIndex(index,value){
            this.queryArr=[];
            for(let item of this.prodConfig.prod_type_list){
                if(item.Type_ID==this.ruleForm.Products_Type){
                    if(item.Attr_Values){
                        let arr=item.Attr_Values;
                        let titles=this.specs[index].title;
                        for(let it in item.Attr_Values){
                            if(it==titles){
                                let arrs=item.Attr_Values[it]
                                for(let item of  arrs){
                                    this.queryArr.push({'value':item});
                                }
                            }
                        }

                    }

                }
            }

            let myArr=this.spec_val_list[index]
            for(let item of myArr){
                for(let i=0;i<this.queryArr.length;i++){
                    if(this.queryArr[i].value==item||this.queryArr[i].value==value){
                        this.queryArr.splice(i,1)
                    }
                }
            }
        }
        getRowsSpan(specsIndex){
            return getArrayMulite(this.spec_val_list,specsIndex);
        }
        changePrice(index){
            if(this.noEditField.Products_Type) return
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
        upThumbSuccessCall(url_list){
            //console.log(url_list)
            this.thumb = this.thumb.concat(url_list)

        }

        upImgsSuccessCall(url_list){
            this.imgs= url_list[0]
        }

        upVideoSuccessCall(url_list){
            //console.log(url_list)
            let video_url = url_list[0]
            this.video = video_url



            let video_img = `${video_url}?x-oss-process=video/snapshot,t_1000,f_jpg,w_200`

            this.imgs = video_img
            // if(!file || !file[0] || !file[0].video_url)return;
            // let {video_url,video_img} = file[0]
            // if(!video_url){
            //     fun.error({msg:'视频地址错误'})
            // }
            // if(!video_img){
            //     fun.error({msg:'视频封面错误'})
            // }
            //
            // if(video_url){
            //     this.video = video_url
            //     //@ts-ignore
            //     //this.$refs.video.handleInitHas([this.video])
            // }
            //
            // if(video_img){
            //     //this.imgs = video_img
            //     //@ts-ignore
            //     //this.$refs.video_cover.handleInitHas([this.imgs])
            // }

        }
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.isLoading=true;
                    let id = this.$route.query.prod_id;

                    if(this.ruleForm.orderType<=0){
                        if(this.ruleForm.Products_Weight<=0){
                            this.$message({
                                type: 'error',
                                message: `实体订单商品重量大于0`
                            });
                            this.isLoading=false;
                            return
                        }
                    }
                    if (this.cate_ids === ''){
                        this.$message({
                            type: 'error',
                            message: `请选择商品分类`
                        });
                        this.isLoading=false;
                        return
                    }
                    if(this.ruleForm.Products_Type==''&&this.ruleForm.Products_Type!=0){
                        this.$message({
                            type: 'error',
                            message: `请选择商品类型1`
                        });
                        this.isLoading=false;
                        return
                    }
                    let productInfo:object = {
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
                        fee_type:this.ruleForm.goods,//运费选择
                        prod_order_type:this.ruleForm.orderType,//订单类型
                        Products_Description:this.editorText,//富文本类型
                        Product_backup:this.ruleForm.refund,//退货id
                        platForm_Income_Reward:this.platForm_Income_Reward,
                        nobi_ratio:this.nobi_ratio,
                        area_Proxy_Reward:this.area_Proxy_Reward,
                        sha_Reward:this.sha_Reward,
                        commission_ratio:this.commission_ratio,
                        manage_Reward:this.manage_Reward
                    };
                    if(this.ruleForm.orderType==2){
                        let arr=[];
                        for(let item of this.multipleSelection){
                            arr.push(item.Card_Id);
                        }
                        productInfo.virtual_card_ids=JSON.stringify(arr);
                    }
                    if(id){
                      productInfo.prod_id=id;
                    }
                    let arrPromise=[];
                    for(let item of this.Products_Promise){
                        arrPromise.push({'name':item});
                    }
                    productInfo.Products_Promise=JSON.stringify(arrPromise);

                    if(this.thumb.length<1){
                        this.$message({
                            type: 'error',
                            message: `商品主图不能为空`
                        });
                        this.isLoading=false;
                        return ;
                    }else {
                        productInfo.Products_JSON=JSON.stringify({"ImgPath":this.thumb})
                    }

                    //优惠券
                    if(this.selectValue.length>0){
                        productInfo.coupon_present=this.selectValue.join(',')
                    }

                    productInfo.video_url=this.video?this.video:'';
                    productInfo.cover_url=this.imgs?this.imgs:'';

                    // if(this.store_list.length>0){
                    //     let arr=[];
                    //     for(let item of this.store_list){
                    //         arr.push(item.Stores_ID);
                    //     }
                    //     if(arr.length>0){
                    //         productInfo.Products_Stores=JSON.stringify(arr);
                    //     }
                    // }

                    for(let item of  this.ruleForm.otherAttributes){
                        if(item=='下架') productInfo.Products_SoldOut=1;
                        if(item=='新品')productInfo.Products_IsNew=1;
                        if(item=='热卖')productInfo.Products_IsHot=1;
                        if(item=='推荐')productInfo.Products_IsRecommend=1;
                    }

                    if(this.ruleForm.goods==1){
                        //如果是免运费的话
                        productInfo.fix_fee=this.fix_fee;
                    }else if(this.ruleForm.goods==2&&this.yunfei.length>0){
                        if(!this.shipping_temp){
                            this.$message({
                                type: 'error',
                                message: `物流模板不能为空`
                            });
                            this.isLoading=false;
                            return;
                        }
                        productInfo.shipping_temp=this.shipping_temp;
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
                        for(let arrList of arrM){
                            if(arrList.Property_count<=0){
                                this.$message({
                                    type: 'error',
                                    message: `库存不能为空`
                                });
                                this.isLoading=false;
                                return;
                            }
                        }
                        let skuList= objTranslate(arrM);
                        for(let idx in skuList){
                            let mbx = skuList[idx]
                            if(typeof mbx.Attr_Value=='object' ){

                            }else{
                                let splitArr=mbx.Attr_Value.split("|");
                                let objSku={};
                                for(let i=0;i<this.specs.length;i++){
                                    objSku[this.specs[i].title]=splitArr[i];
                                }
                                mbx.Attr_Value=objSku;



                            }


                            //批量新增图片
                            //利用对应的规格获取在第一个规格可选值的vals的索引
                            if(this.skuImg){

                              let specItemIdx = -1
                              //当只有一个规格的时候，特殊情况
                              if(this.specs.length===1){
                                specItemIdx = this.specs[0].vals.indexOf(this.skus[0][idx])
                              }else{
                                specItemIdx = this.specs[0].vals.indexOf(this.skus[idx][0])
                              }

                              if(this.specs[0].imgs){
                                  if(specItemIdx!=-1 && this.specs[0].imgs[specItemIdx]){
                                      mbx.Attr_Image = this.specs[0].imgs[specItemIdx]
                                  }else{
                                      mbx.Attr_Image = ''
                                  }
                              }
                            }else{

                            }



                        }

                        // @ts-ignore
                        productInfo.prod_attrval=JSON.stringify({
                            'attrs':attrs,
                            'values':skuList
                        })
                    }
                    //const allowLevel = [1,2,3,4,110]
                    //分销商 价格
                    if(this.dis_level_list.length>0){
                        let disArr=this.dis_level_list;
                        let disObj={};
                        for(let dis=0;dis<disArr.length;dis++){
                            let arr=disArr[dis].Level_ID;
                            //如果没有自销分销商
                            if(this.prodConfig.Dis_Self_Bonus==0){
                                let c=this.prodConfig.Dis_Level
                                delete this.distriboutor_config[dis][c];
                            }
                            let arr2=this.distriboutor_config[dis];
                            disObj[arr]=arr2;
                        }
                        productInfo.Products_Distributes=JSON.stringify(disObj);
                    }
                    let prodObj={}
                    //限购prod_limit
                    prodObj={
                        switch:this.ruleForm.prod_limit?1:0,
                        limit:{
                            type:this.vipType,
                            num:this.vipNum
                        }
                    }
                    productInfo.prod_limit=JSON.stringify(prodObj)
                    productInfo.self_commi=this.self_commi
                    productInfo.parent_commi=this.parent_commi
                    productInfo.manage_commi=this.manage_commi
                    systemOperateProd(productInfo,{}).then(res=>{
                        if(res.errorCode==0){
                            this.isLoading=false;
                            if(id){
                                this.$message({
                                    message: '修改成功',
                                    type: 'success'
                                });
                                //window.location.href=window.parent.location.href+'shop/setting/diy/index.html#/ProductList';
                                this.$router.push({
                                    name: 'ProductList'
                                })
                            }else{
                                this.$message({
                                    message: '添加成功',
                                    type: 'success'
                                });
                                this.$router.push({
                                    name: 'ProductList'
                                })
                                //window.location.href=window.parent.location.href+\'shop/setting/diy/index.html#/ProductList';
                            }
                        }

                    }).catch(e=>{
                        console.log(e)
                    })
                    this.isLoading=false;
                } else {
                    this.isLoading=false;
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

        /**
         * 从某个一维数组中（利用pid来区分上下级，且最高级的pid为0)获取所有父级的id
         * @param arr
         * @param item
         * @param key
         */
        getAllPid({arr,self,key,pkey,root_pkey_val=0,rt=[]}){
            //console.log(...arguments)
            for(let item of arr){
                if(item[key] == self[pkey]){
                    rt.push(item[key])
                    //如果存在
                    if(item[pkey]!=root_pkey_val){
                        this.getAllPid({arr,'self':item,'key':key,'pkey':pkey,root_pkey_val,rt});
                    }
                    break;
                }
            }
        }
        bindCateSuccessCall(dataType, type, path, tooltip, dataArr, pageEl, idx2,ext){

            let origin_cate_list = ext//获取所有的菜单数据，方便后面拼接。

            //把数组铺平城一维数组
            let plain_cate_list = []
            plainArray(origin_cate_list,'children',plain_cate_list)
            //console.log(plain_cate_list)

            console.log('原始数据',origin_cate_list)
            console.log('返回的数据',dataArr)

            let child_arr = [];
            let cate_data = {}
            let str=''
            let all_cate_list = []
            //console.log("ssss",plain_cate_list)
            if(dataArr.length>0){
                for(let item of dataArr){
                    str+=item.Category_ID+','+item.Category_ParentID+','  // +item.Category_ParentID+',' 选中第三级的时候把第一级第二级也选中
                    all_cate_list.push(item.Category_ID)
                    this.getAllPid({arr:plain_cate_list,self:item,key:'Category_ID',pkey:'Category_ParentID',rt:all_cate_list})
                }
                str=str.substr(0,str.length-1)
            }

            //console.log('all_cate_list is ',all_cate_list)

            let resultarr = [...new Set(all_cate_list)];
            console.log('all_cate_list end is ',resultarr)

            //this.cate_ids= str;//resultarr.join(',')
            this.cate_ids=resultarr.join(',')


            let cates_end_list = []
            for(let row of plain_cate_list){
                if(resultarr.includes(row.Category_ID)){
                    cates_end_list.push(row)
                }
            }

            this.show_cate_list = cates_end_list.map(cate=>{
                return {Category_Name:cate.Category_Name,Category_ID:cate.Category_ID}
            })

            this.cate_list = dataArr.map(cate=>{
                return {Category_Name:cate.Category_Name,Category_ID:cate.Category_ID}
            })



            // this.cate_ids = JSON.stringify(cate_data)//ids.store('|')
            this.bindCateDialogShow = false
        }
        bindStoreCancel(){
            this.dialogStoreShow = false
        }
        bindStoreSuccessCall(list){
            this.store_list = list
            this.store_id_list = list.map(store=>{
                return store.Stores_ID
            })
            this.dialogStoreShow = false
        }
        settingCancel(){
            this.commission=false;
        }
        settingSuccessCall(){
            this.commission=false;
        }
        initSpecItemPic(){
            if(this.specs[0] && this.specs[0].imgs && this.specs[0].imgs.length>0){
                let imgs = this.specs[0].imgs

               for(var idx in imgs){

                   if(!imgs[idx])continue

                   //让显示出来
                   this.skuImg = true;//表示有参数
                   //初始化一下

                   // var _self = this;
                   //
                   // if(_self.$refs.specPic && _self.$refs.specPic[idx]){
                   //
                   //     //_self.$refs.specPic[idx].handleInitHas([imgs[idx]])
                   // }

               }
            }
        }


        @Watch('specs', { deep: true,immediate:true })
        handleWatch(){
            if(this.skuList.length>1){
                this.skusData=this.skuList
            }
            this.createSkuData();


        }

        @Watch('ruleForm.Products_Type', { deep: true,immediate:true })
        handle(val){
            if(!val)return;
            for(let item of this.prodConfig.prod_type_list){
                if(item.Type_ID===this.ruleForm.Products_Type){
                    this.specs=[];
                    for(let it of item.Attr_Name){
                        this.specs.push({title:it,vals:[]});
                    }
                }
            }

              if(this.initialPro.prod_attrval && this.initialPro.prod_attrval.attrs){

                for(let idx in this.initialPro.prod_attrval.attrs){

                    for(let i in this.specs){
                        let item = this.specs[i];
                        if(item.title==idx){
                            item.vals = this.initialPro.prod_attrval.attrs[idx];
                        }
                    }
                }
            }


            if(this.initialPro.prod_attrval && this.initialPro.prod_attrval.values){
                let arrProd=this.initialPro.prod_attrval.values;
                for(let pro of arrProd){
                    let arr=[];
                    for(let pr in pro.Attr_Value){

                        //去拼接
                        if(pr === this.specs[0].title){
                            let idx = this.specs[0].vals.indexOf(pro.Attr_Value[pr]);
                            if(idx!=-1){
                                //初始化规格图片
                                if(!this.specs[0].imgs){
                                    this.$set(this.specs[0],'imgs',[])
                                }
                                if(!this.specs[0].imgs[idx]){
                                    this.specs[0].imgs[idx] = pro.Attr_Image
                                }

                            }
                        }

                        arr.push(pro.Attr_Value[pr]);
                    }
                    pro['Attr_Value']=arr.join("|");
                }

                // console.log(this.specs[0] && this.specs[0].imgs && this.specs[0].imgs.length>0)


                var _self = this
                setTimeout(function () {
                    _self.initSpecItemPic()
                },1000)

                this.initialSku=arrProd;
            }

        }


        async created(){

            const loadingObj = this.$loading({
                lock: true,
                text: '拼命加载中',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.3)'
            })

            await systemProdConfig().then(res=>{
                this.prodConfig=res.data;
                this.prodConfig.prod_type_list.unshift({Attr_ID: 0,
                    Attr_Name: [],
                    Attr_Values:'',
                    Type_ID: 0,
                    Type_Name: "无规格"})
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
                    //修改分销商
                        tempArr[i].push('')
                }

                this.$set(this,'distriboutor_config',tempArr);
                //this.distriboutor_config = tempArr;
                //修改分校等级
                let obj={}
                let indexMy=0
                //木贝西
                for(let item in this.prodConfig.Shop_Commision_Reward_Json.Distribute){
                    indexMy++
                    for(let mb in this.prodConfig.Shop_Commision_Reward_Json.Distribute[item]){
                        obj[mb]=0
                    }
                        for(let i=0;i<this.dis_level_list.length;i++){
                            if(item==(this.dis_level_list[i].Level_ID)){
                                this.distriboutor_config[i]=this.prodConfig.Shop_Commision_Reward_Json.Distribute[item];
                            }
                        }

                }
                //this.distriboutor_config[6]=obj




                this.platForm_Income_Reward=res.data.Shop_Commision_Reward_Json.platForm_Income_Reward;
                this.nobi_ratio=res.data.Shop_Commision_Reward_Json.noBi_Reward;
                this.sha_Reward=res.data.Shop_Commision_Reward_Json.sha_Reward;
                this.area_Proxy_Reward=res.data.Shop_Commision_Reward_Json.area_Proxy_Reward;
                this.commission_ratio=res.data.Shop_Commision_Reward_Json.commission_Reward;
                this.manage_Reward=res.data.Shop_Commision_Reward_Json.manage_Reward;
            }).catch();

            let id = this.$route.query.prod_id;
            await getShippingTemplate().then(res=>{
                this.yunfei=res.data
            })
            await  virtualCardList({prod_id:id}).then(res=>{
                this.CardList=res.data;
                this.multipleSelection=[];
                for(let item of this.CardList){
                    if(item.Products_Relation_ID==id){
                        this.multipleSelection.push(item)
                    }
                }
            })
            await virtualCardType().then(res=>{
                this.CardType=res.data;
            })



            let productInfo = {}
            let Products_Stores = []
            let select_cate_ids = []
            loadingObj.close()
            if(id){
                this.addText="提交保存";
                //编辑模式，需要加载商品信息
                const productRT = await systemProdDetail({prod_id:id})
              let productInfo = productRT.data


                //优惠券
                this.selectValue=productInfo.coupon_present.split(',')
                getGivingCoupons({pageSize:9999,page:1}).then(res=>{
                    if(res.errorCode==0){
                        let data=res.data
                        this.productData=[]
                        for(let item of data){
                            for(let it of this.selectValue){
                                if(item.id==it){
                                    this.productData.push(item)
                                }
                            }
                        }
                    }
                })

              console.log(productInfo)
              this.parent_commi=String(productInfo.commi_type.parent_commi)
              this.self_commi=String(productInfo.commi_type.self_commi)
              this.manage_commi=String(productInfo.commi_type.manage_commi)
              this.textTitle=productInfo.active_desc;
              this.initialPro=productInfo;
              this.noEditField=productInfo.no_edit_field;
              let objNoEdit={};
              if(this.noEditField.length>0){
                for(let item of  this.noEditField){
                  objNoEdit[item]=true;
                }
              }
              this.noEditField=objNoEdit;

              this.ruleForm.Products_Index=productInfo.Products_Index;//商品排序
              this.ruleForm.Products_Name=productInfo.Products_Name;//商品名称

              select_cate_ids = productInfo.Products_Category;//商品分类
              this.ruleForm.Products_Sales=productInfo.Products_Sales;//虚拟销量
              this.ruleForm.Products_PriceY=productInfo.Products_PriceY;//原价
              this.ruleForm.Products_PriceX=productInfo.Products_PriceX;//现价
              this.ruleForm.pintuan_flag=productInfo.pintuan_flag?true:false;//是否拼团
              this.ruleForm.Products_Profit=productInfo.Products_Profit;//产品利润
              this.ruleForm.Products_BriefDescription=productInfo.Products_BriefDescription;//产品简介
              this.ruleForm.Products_Count=productInfo.Products_Count;//库存
              this.ruleForm.Products_Type=productInfo.Products_Type;//商品类型id
              this.ruleForm.Products_Weight=productInfo.Products_Weight;//商品重量
              this.ruleForm.goods=String(productInfo.fee_type);//运费选择
              this.ruleForm.freight=String(productInfo.Shipping_Free_Company);
              this.ruleForm.orderType=String(productInfo.prod_order_type);//订单类型

              this.editorText=productInfo.Products_Description;//富文本类型
              if(this.ruleForm.goods==1){
                  this.fix_fee =productInfo.fix_fee
              }else if(this.ruleForm.goods==2&&this.yunfei.length>0){
                  this.shipping_temp =productInfo.shipping_temp
              }
              this.$nextTick().then(()=>{
                //做一下富文本的格式化，兼容原来浏览器的视频标签
                let richTxt = formatRichTextByKindEditor(productInfo.Products_Description)
                this.$refs.richtext.setData(richTxt)
              })


              this.ruleForm.refund=productInfo.Product_backup;//退货id
              this.ruleForm.Products_IsPaysBalance=productInfo.Products_IsPaysBalance?true:false;//是否使用余额


              this.distriboutor_config=[];
              //木贝西
              //当商品之后又新增分销商
              // for(let mb in this.prodConfig.Shop_Commision_Reward_Json.Distribute){
              //     for(let it of this.prodConfig.Shop_Commision_Reward_Json.dis_level_list){
              //         if(mb!=it.Level_ID){
              //            this.prodConfig.Shop_Commision_Reward_Json.Distribute[it.Level_ID]={}
              //         }
              //     }
              // }
              for(let mb in this.prodConfig.Shop_Commision_Reward_Json.Distribute){
                if(!productInfo.Products_Distributes[mb]){
                  productInfo.Products_Distributes[mb]=this.prodConfig.Shop_Commision_Reward_Json.Distribute[mb]
                }

              }
              for(let it in productInfo.Products_Distributes){
                if(Array.isArray(productInfo.Products_Distributes[it])){
                  let obj={
                  }

                  for(let inde=0;inde<=this.prodConfig.Dis_Level;inde++){
                    obj[inde]=productInfo.Products_Distributes[it][inde]
                  }
                  obj['110']=''
                  this.distriboutor_config.push(obj)
                }else{
                  this.distriboutor_config.push(productInfo.Products_Distributes[it])
                }

              }




              //限购
              if(productInfo.prod_limit!=''){
                this.ruleForm.prod_limit=productInfo.prod_limit.switch==1?true:false
                this.vipType=productInfo.prod_limit.limit.type
                this.vipNum=productInfo.prod_limit.limit.num
              }


              //佣金设置
              this.platForm_Income_Reward=productInfo.platForm_Income_Reward;
              this.nobi_ratio=productInfo.nobi_ratio;
              this.area_Proxy_Reward=productInfo.area_Proxy_Reward;
              this.sha_Reward=productInfo.sha_Reward;
              this.commission_ratio=productInfo.commission_ratio;
              this.manage_Reward=productInfo.manage_Reward

              this.Products_Promise=[];
              if(productInfo.Products_SoldOut){
                this.ruleForm.otherAttributes.push('下架')
              }
              if(productInfo.Products_IsNew){
                this.ruleForm.otherAttributes.push('新品')
              }
              if(productInfo.Products_IsHot){
                this.ruleForm.otherAttributes.push('热卖')
              }
              if(productInfo.Products_IsRecommend){
                this.ruleForm.otherAttributes.push('推荐')
              }
              for(let item of productInfo.Products_Promise){
                this.Products_Promise.push(item.name);
              }


              if(this.ruleForm.pintuan_flag){
                this.ruleForm.pintuan_people=productInfo.pintuan_people;
                this.ruleForm.pintuan_pricex=productInfo.pintuan_pricex;
                this.ruleForm.pintuan_end_time = new Date(productInfo.pintuan_end_time*1000);
              }


              //缩略图
              //@ts-ignore
              if(productInfo.Products_JSON.ImgPath){
                this.thumb = productInfo.Products_JSON.ImgPath
              }


              //@ts-ignore
              if(!emptyValue(productInfo.video_url)){
                this.video = productInfo.video_url;
              }

              //@ts-ignore
              if(!emptyValue(productInfo.cover_url)){
                this.imgs =  productInfo.cover_url;
              }


              //组件里面初始化
              //@ts-ignore
              //this.$refs.thumb.handleInitHas(this.thumb)

              if(this.video){
                //@ts-ignore
                //this.$refs.video.handleInitHas([this.video],'video')
              }

              if(this.imgs){
                //@ts-ignore
                //this.$refs.video_cover.handleInitHas([this.imgs])
              }

              Products_Stores = productInfo.Products_Stores


                //初始化商品分类
                let getCateData = await getProductCategory({})
              let origin_cate_list = getCateData.data

              let cates = []

              let dataArr =[]

              let  all_cate_list = []
              //铺平数组
              this.plainArrays(origin_cate_list,'child',cates)
              console.log(cates,select_cate_ids)
                //西西
              for(var cate of cates){
                if(select_cate_ids.indexOf(cate.Category_ID+'')!=-1){
                  //console.log(cate)
                  dataArr.push(cate)

                  all_cate_list.push(cate.Category_ID)
                  this.getAllPid({arr:cates,self:cate,key:'Category_ID',pkey:'Category_ParentID',rt:all_cate_list})
                }
              }


              //模拟选择菜单后的
              //let dataArr = this.cate_list

              let str=''
              if(dataArr.length>0){
                for(let item of dataArr){
                  str+=item.Category_ID+','
                }
                str=str.substr(0,str.length-1)
              }
              //console.log(dataArr)
              this.cate_ids=str



              //console.log('初始化的参数',dataArr)

              //console.log('all_cate_list is ',all_cate_list)

              let resultarr = [...new Set(all_cate_list)];
              //console.log('all_cate_list end is ',resultarr)

              this.cate_ids=resultarr.join(',')

              let cates_end_list = []
              for(let row of cates){
                if(resultarr.includes(row.Category_ID)){
                  cates_end_list.push(row)
                }
              }

              this.show_cate_list = cates_end_list.map(cate=>{
                return {Category_Name:cate.Category_Name,Category_ID:cate.Category_ID}
              })
               //新增遍历
              let dataArrTwo=[]
                for(let item of cates){
                    for(let it of  dataArr){
                        if(item.Category_ID==it.Category_ID&&item.child!=1){
                              dataArrTwo.push(it)
                        }
                    }
                }
              //console.log(dataArrTwo,dataArr,"qqqq")
              this.cate_list = dataArrTwo.map(cate=>{
                return {Category_Name:cate.Category_Name,Category_ID:cate.Category_ID}
              })

              loadingObj.close()

                //初始化店铺列表
                // await getStoreList().then(res=>{
                //     let stores = res.data
                //     for(var item of stores){
                //         if(Products_Stores.indexOf(item.Stores_ID)!=-1){
                //             this.store_list.push(item)
                //         }
                //     }
                // })
            }else{
              loadingObj.close()
            }



        }

        mounted(){



        }


    }
</script>

<style scoped lang="less">
.preview-spec-box{
  display: block;
}
.preview-box{
  display: inline-block;
  .preview-item{
    display: inline-block;
    width: 80px;
    height: 80px;
    box-sizing: border-box;
    position: relative;
    margin-right: 10px;
    margin-bottom: 10px;
    border-radius: 6px;
    background-color: #fff;
    border: 1px solid #c0ccda;
    overflow: hidden;
    .img{
      width: 100%;
      max-height: 100%;
    }
    .actions{
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      cursor: default;
      text-align: center;
      color: #fff;
      opacity: 0;
      font-size: 20px;
      background-color: rgba(0,0,0,.5);
      -webkit-transition: opacity .3s;
      transition: opacity .3s;
      &.thumb-actions{
        padding: 10px;
        box-sizing: border-box;

        .row{
          height: 30px;
          align-items: center;
          display: flex;
          justify-content: center;
          .icon{
            cursor: pointer;
            /*margin-left: 0 !important;*/
            line-height: 1;
          }
        }
        /*align-items: center;*/

      }
      &::after{
        display: inline-block;
        content: "";
        height: 100%;
        vertical-align: middle;
      }
      span+span{margin-left:15px}
      &:hover{
        opacity:1;
        span{
          display: inline-block;
        }
      }
      .__item-preview{
        cursor: pointer;
      }
      .__item-delete{
        cursor: pointer;
        position: static;
        font-size: inherit;
        color: inherit;
      }
    }


  }

}
.js-finder-label{
  display: inline-block;
  background-color: #fbfdff;
  border: 1px dashed #c0ccda;
  border-radius: 6px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  width: 80px;
  height: 80px;
  line-height: 80px;
  vertical-align: top;
  text-align: center;
  cursor: pointer;
  .el-icon-plus{
    font-size: 28px;
    color: #8c939d;
  }
}
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
      padding: 4px 20px;
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
.ponint{
  cursor: pointer;
}
.specs_row{
  margin-bottom: 10px;
  display: flex;
  .label{
    width: 100px;
  }
  .specs-item-list{
    flex: 1;
    display: flex;
    flex-wrap: wrap;
    .spec-item-box{
      margin-bottom: 15px;
      /*display: flex;*/
      /*flex-wrap: wrap;*/
      /*align-items: center;*/
      .uploadThumb{
        margin: 0 10px;
        margin-top: 20px;
        margin-left: 24px;
      }
    }
  }
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
  width: 15%;
  text-align: center;
  line-height: 50px;
  height: 50px;
  border-right: 1px solid @border;
}
.rightTitle{
  width: 85%;
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
  flex-wrap: wrap;
}
.fenxiaoshang{
  background-color: #F8F8F8;
  /*width: 320px;*/
  margin-right: 15px;
  margin-bottom: 20px;
  .label{
    display: inline-block;
    /*min-width: 60px;*/
    min-width: 30px;
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

.cardTitle{
  display: flex;
  align-items: center;
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
table{
  border: 1px solid #DBDBDB;
}
  .inputSku /deep/ .el-input__inner {
    background-color: #F8F8F8 !important;
  }
  .borderRight{
    border-right: 0px;
  }
.paddingAll{
  padding: 20px;
}
  .padding15-t{
    padding-top: 5px;
    padding-bottom: 5px;
  }
  .marginBootom{
    margin-bottom: 0px;
    text-align: left;
  }
  .textTitle /deep/ .el-form-item__label{
    color: red;
  }
  .relative{
    position: relative;
  }
  .setting /deep/ .el-dialog__body{
    height: 700px;
    overflow: auto;
  }
  .setting /deep/ .el-dialog{
    margin-top: 60px !important;
  }

.bottomFixed{
  position: fixed;
  padding: 10px 0;
  box-sizing: border-box;
  bottom: 0;
  width: 100%;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-align: center;
  align-items: center;
  -ms-flex-pack: center;
  justify-content: center;
  background-color: #fff;
  box-shadow: 0 -3px 5px #eee;
  z-index: 1;
  transition: right .2s ease;
}
.lst{
  height: 30px;
  position: relative;
  line-height: 30px;
  background-color: #F8F8F8;
  padding: 0px  8px;
  box-sizing: border-box;
  margin-right: 20px;
  display: inline-block;
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

  .lst-q{
    cursor: pointer;color: #409eff;height: 30px;line-height: 30px; padding: 0px  8px; box-sizing: border-box; display: inline-block;
  }
</style>
