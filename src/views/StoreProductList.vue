<template>
  <div class="home-wrap">
    <div style="padding: 20px">
      <!--      get_self_store_prod-->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="出售中" name="1"></el-tab-pane>
        <el-tab-pane label="已售完" name="2"></el-tab-pane>
        <el-tab-pane label="已下架" name="3"></el-tab-pane>
      </el-tabs>
      <div class="padding10">
        <el-button  size="mini" class="" type="primary" @click="goProduct">退货</el-button>
      </div>
      <fun-table
        :columns="dataTableOpt.columns"
        :dataList="dataTableOpt.dataList"
        :act="dataTableOpt.act"
        :totalCount="dataTableOpt.totalCount"
        :pageSize="dataTableOpt.pageSize"
        :is_paginate="dataTableOpt.is_paginate"
        :formSize="'small'"
        :isRow="true"
        @handleSizeChange="handleSizeChange"
        @currentChange="currentChange"
        @selectVal="selectVal"
        @submit="submit"
        @reset="reset"
      >
        <template slot="Products_Name-column" slot-scope="props" >
          <div style="display: flex;align-items: center;">
            <img width="90px" height="100px" :src="props.row.img_url">
            <span style="margin-left: 10px">{{props.row.Products_Name}}</span>
          </div>
        </template>
        <template slot="Products_Qrcode-column" slot-scope="props">
          <img height="70px" width="70px" :src="props.row.Products_Qrcode">
        </template>
        <template slot="attr-column"  slot-scope="props">
          <div v-for="(item,index) of props.row.oattrs" >
            <el-tag style="width:80px;margin:0 auto;margin-bottom: 5px;display: block;">{{item}}</el-tag>
          </div>
        </template>
        <template slot="Products_Sales-column" slot-scope="props">
          <span>{{props.row.Products_Sales}}/{{props.row.Products_Count}}</span>
        </template>
        <template slot="operate-column" slot-scope="props">
          <span class="spans" @click="delProduct(props)">退货</span>
        </template>
      </fun-table>
    </div>


    <el-dialog title="商品佣金详情" :visible.sync="settingShow">
      <el-table :data="settingData" >
        <el-table-column align="center" type="index" label="序号" width="150"></el-table-column>
        <el-table-column align="center" property="level_name" label="级别名称" width="200"></el-table-column>
        <el-table-column align="center" label="佣金明细">
          <template  slot-scope="scope" >
            <div v-for="(item,index) of settingData[scope.$index].commisions">
              {{item.label}}{{item.value}}(佣金比例的百分比)
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>


        <div class="foot">
          <div class="count" style="cursor: pointer">
            <!--          /{{paginate.totalCount}}-->
            <div class="text">
              <span @click="cartDialogOpen"  v-show="!cartsDialogInstance.innerVisible">已选取<span class="danger-color">{{count_num}}</span>个普通商品</span>
              <span @click="cartDialogCancel" v-show="cartsDialogInstance.innerVisible">已选取<span class="danger-color">{{count_num}}</span>个普通商品</span>
              <i @click="cartDialogOpen"  v-show="!cartsDialogInstance.innerVisible" class="el-icon-arrow-up"></i>
              <i @click="cartDialogCancel" v-show="cartsDialogInstance.innerVisible" class="el-icon-arrow-down"></i>
            </div>
          </div>
          <el-button class="sub-btn" @click="subFn" v-loading="subLoading">提交进货单</el-button>
        </div>
        <div id="imgs"></div>


    <div @click="cartDialogCancel" class="cartsDialogMask"  @mousewheel.prevent  v-show="cartsDialogInstance.innerVisible"></div>
    <div class="cartsDialog" v-show="cartsDialogInstance.innerVisible"  v-loading="cartsDialogInstance.loading">
      <div class="carts-dialog-container" v-if="carts.lists.length>0" >
        <div class="goods-item" v-for="(goods,idx) of carts.lists" :key="idx"  >
          <div class="cover" :style="{backgroundImage: 'url('+goods.ImgPath+')'}"><i @click="cartRemoveFn(goods)" class="el-icon-error"></i></div>
          <div class="title">{{goods.Products_Name}}</div>
          <!--{{formatSpec(goods.spec_key,',')}}-->
          <div class="attr">{{goods.Productsattrstrval||'无规格'}}</div>
          <div class="numbox" >
            <span class="label">数量: </span>
            <input class="input" v-model="goods.num" readonly />
            <div class="num-btns">
              <span @click="cartPlusFn(goods,goods.num)" class="num-btn plus-btn"><i class="el-icon-arrow-up"></i></span>
              <span @click="cartMinusFn(goods,goods.num)" class="num-btn minus-btn"><i class="el-icon-arrow-down"></i></span>
            </div>
            <!--            <el-input-number @change="cartNumChange" controls-position="right" :min="1" :max="goods.Products_Count" size="mini" v-model="goods.num" :step="1"></el-input-number>-->
          </div>
        </div>
      </div>
      <div class="carts-dialog-container" v-else style="padding-top: 50px;display: block">
        <div class="text-center"><i style="font-size: 100px;color: #999" class="el-icon-shopping-cart-2"></i></div>
        <div class="padding10-r graytext text-center">购物车空空如也</div>
      </div>
      <span slot="footer" class="dialog-footer"></span>
    </div>

  </div>
</template>
<script lang="ts">
    import {
        Component,
        Vue
    } from 'vue-property-decorator'
    import {
        Action,
        State
    } from 'vuex-class'

    import {getProducts,batchSetting,getProductCategory,delProduct} from '@/common/fetch';
    import {findArrayIdx, plainArray, createTmplArray, objTranslate} from '@/common/utils';
    import _ from 'underscore'
    import {float} from "html2canvas/dist/types/css/property-descriptors/float";
    const getParentsCount = (arr,key,pkey,val,tempArr)=>{
        var idx = false
        for(var i in arr){
            let item = arr[i]
            if(item[key] == val[pkey]){
                idx = i
                break;
            }
        }
        if(idx!==false){
            tempArr.push(1)
            //循环
            getParentsCount(arr,key,pkey,arr[idx],tempArr)
        }
    }
    const restArr = (arr,key)=>{
        let plainArr = []
        plainArray(arr,key,plainArr)
        for(var i in plainArr){
            let item = plainArr[i]
            item.parent_count = 0;
            let tempArr = []
            if(item['Category_ParentID']){
                getParentsCount(plainArr,'Category_ID','Category_ParentID',item,tempArr)
                item.parent_count = objTranslate(tempArr).length
            }
            item.new_name = createTmplArray('　├　',item.parent_count).join('')+item.Category_Name
        }
        return plainArr
    }

    const mockDataList  = [{"Products_ID":643,"Products_Type":91,"Products_Name":"Nike Air PRESTO 2.0 x OFF-WHITE 联名黑白休闲男跑步鞋 AA3830 AA3830-100 36","Products_JSON":{"ImgPath":["https://new401.bafangka.com/uploadfiles/wkbq6nc2kc/image/20191120101945150.jpg","https://new401.bafangka.com/uploadfiles/wkbq6nc2kc/image/20191120101945135.jpg","https://new401.bafangka.com/uploadfiles/wkbq6nc2kc/image/20191120101945146.jpg"]},"Products_PriceY":"9999.00","Products_PriceX":"6666.00","Products_SoldOut":0,"Products_Status":1,"Products_Count":71092,"Products_Sales":16367631,"Products_Weight":"12.50","Products_IsVirtual":0,"Products_IsRecieve":0,"Products_IsHot":1,"Products_IsNew":1,"Products_IsRecommend":1,"Products_IsShippingFree":0,"Products_IsPaysBalance":1,"click_count":61,"pintuan_flag":1,"pintuan_people":2,"pintuan_start_time":1574758429,"pintuan_end_time":1574870400,"pintuan_pricex":"22.00","Products_BriefDescription":"海红专卖店aj门店发货","ImgPath":"https://new401.bafangka.com/uploadfiles/wkbq6nc2kc/image/20191120101945150.jpg","is_pintuan":0,"skujosn":{"颜色":{"1":"黑色","2":"白色"},"尺寸":{"3":"41","4":"42"},"面料":{"5":"羊皮","6":"牛皮"}},"skuvaljosn":{"1;3;5":{"Product_Attr_ID":608,"Products_ID":643,"Attr_ID":76,"Attr_Value":{"颜色":"黑色","尺寸":"41","面料":"羊皮"},"Attr_Price":6676,"Supply_Price":"0.00","pt_pricex":"0.00","Property_count":8888,"number_id":"","Attr_Image":"https://new401.bafangka.com/uploadfiles/wkbq6nc2kc/image/20191120102901181.jpg"},"1;3;6":{"Product_Attr_ID":609,"Products_ID":643,"Attr_ID":76,"Attr_Value":{"颜色":"黑色","尺寸":"41","面料":"牛皮"},"Attr_Price":6676,"Supply_Price":"0.00","pt_pricex":"0.00","Property_count":8888,"number_id":"","Attr_Image":"https://new401.bafangka.com/uploadfiles/wkbq6nc2kc/image/20191120102901181.jpg"},"1;4;5":{"Product_Attr_ID":610,"Products_ID":643,"Attr_ID":76,"Attr_Value":{"颜色":"黑色","尺寸":"42","面料":"羊皮"},"Attr_Price":6686,"Supply_Price":"0.00","pt_pricex":"0.00","Property_count":8888,"number_id":"","Attr_Image":"https://new401.bafangka.com/uploadfiles/wkbq6nc2kc/image/20191120102901181.jpg"},"1;4;6":{"Product_Attr_ID":611,"Products_ID":643,"Attr_ID":76,"Attr_Value":{"颜色":"黑色","尺寸":"42","面料":"牛皮"},"Attr_Price":6686,"Supply_Price":"0.00","pt_pricex":"0.00","Property_count":8888,"number_id":"","Attr_Image":"https://new401.bafangka.com/uploadfiles/wkbq6nc2kc/image/20191120102901181.jpg"},"2;3;5":{"Product_Attr_ID":612,"Products_ID":643,"Attr_ID":76,"Attr_Value":{"颜色":"白色","尺寸":"41","面料":"羊皮"},"Attr_Price":6696,"Supply_Price":"0.00","pt_pricex":"0.00","Property_count":8888,"number_id":"","Attr_Image":"https://new401.bafangka.com/uploadfiles/wkbq6nc2kc/image/20191120102002106.jpg"},"2;3;6":{"Product_Attr_ID":613,"Products_ID":643,"Attr_ID":76,"Attr_Value":{"颜色":"白色","尺寸":"41","面料":"牛皮"},"Attr_Price":6696,"Supply_Price":"0.00","pt_pricex":"0.00","Property_count":8888,"number_id":"","Attr_Image":"https://new401.bafangka.com/uploadfiles/wkbq6nc2kc/image/20191120102002106.jpg"},"2;4;5":{"Product_Attr_ID":614,"Products_ID":643,"Attr_ID":76,"Attr_Value":{"颜色":"白色","尺寸":"42","面料":"羊皮"},"Attr_Price":6706,"Supply_Price":"0.00","pt_pricex":"0.00","Property_count":8888,"number_id":"","Attr_Image":"https://new401.bafangka.com/uploadfiles/wkbq6nc2kc/image/20191120102002106.jpg"},"2;4;6":{"Product_Attr_ID":615,"Products_ID":643,"Attr_ID":76,"Attr_Value":{"颜色":"白色","尺寸":"42","面料":"牛皮"},"Attr_Price":6706,"Supply_Price":"0.00","pt_pricex":"0.00","Property_count":8876,"number_id":"","Attr_Image":"https://new401.bafangka.com/uploadfiles/wkbq6nc2kc/image/20191120102002106.jpg"}}},{"Products_ID":754,"Products_Type":0,"Products_Name":"大话西游点卡50点","Products_JSON":{"ImgPath":["https://new401.bafangka.com/uploadfiles/wkbq6nc2kc/image/20191127105546183.png"]},"Products_PriceY":"10.00","Products_PriceX":"5.00","Products_SoldOut":0,"Products_Status":1,"Products_Count":98,"Products_Sales":402,"Products_Weight":"0.00","Products_IsVirtual":1,"Products_IsRecieve":0,"Products_IsHot":0,"Products_IsNew":1,"Products_IsRecommend":0,"Products_IsShippingFree":0,"Products_IsPaysBalance":1,"click_count":16,"pintuan_flag":0,"pintuan_people":0,"pintuan_start_time":0,"pintuan_end_time":0,"pintuan_pricex":"0.00","Products_BriefDescription":"大话西游点卡50点","ImgPath":"https://new401.bafangka.com/uploadfiles/wkbq6nc2kc/image/20191127105546183.png","is_pintuan":0},{"Products_ID":761,"Products_Type":91,"Products_Name":"一个限购的鞋子","Products_JSON":{"ImgPath":["https://new401.bafangka.com/uploadfiles/wkbq6nc2kc/image/20191127142814104.png"]},"Products_PriceY":"100.00","Products_PriceX":"80.00","Products_SoldOut":0,"Products_Status":1,"Products_Count":8,"Products_Sales":44000,"Products_Weight":"1.00","Products_IsVirtual":0,"Products_IsRecieve":0,"Products_IsHot":0,"Products_IsNew":0,"Products_IsRecommend":0,"Products_IsShippingFree":0,"Products_IsPaysBalance":1,"click_count":4,"pintuan_flag":0,"pintuan_people":0,"pintuan_start_time":0,"pintuan_end_time":0,"pintuan_pricex":"0.00","Products_BriefDescription":"一个限购的鞋子","ImgPath":"https://new401.bafangka.com/uploadfiles/wkbq6nc2kc/image/20191127142814104.png","is_pintuan":0,"skujosn":{"颜色":{"1":"黑色","2":"黄色"},"尺寸":{"3":"L"},"面料":{"4":"猪皮"}},"skuvaljosn":{"1;3;4":{"Product_Attr_ID":716,"Products_ID":761,"Attr_ID":76,"Attr_Value":{"颜色":"黑色","尺寸":"L","面料":"猪皮"},"Attr_Price":81,"Supply_Price":"3.00","pt_pricex":"0.00","Property_count":6,"number_id":"","Attr_Image":""},"2;3;4":{"Product_Attr_ID":717,"Products_ID":761,"Attr_ID":76,"Attr_Value":{"颜色":"黄色","尺寸":"L","面料":"猪皮"},"Attr_Price":81,"Supply_Price":"3.00","pt_pricex":"0.00","Property_count":2,"number_id":"","Attr_Image":"https://new401.bafangka.com/uploadfiles/wkbq6nc2kc/image/20191127144216188.jpg"}}},{"Products_ID":536,"Products_Type":0,"Products_Name":"全自动按摩加热洗脚足浴盆电动恒温家用深桶泡脚神器足疗机","Products_JSON":{"ImgPath":["https://new401.bafangka.com/uploadfiles/wkbq6nc2kc/image/5dca53b6f9.jpg","https://new401.bafangka.com/uploadfiles/wkbq6nc2kc/image/5dca53c52f.jpg","https://new401.bafangka.com/uploadfiles/wkbq6nc2kc/image/5dca53d179.jpg"]},"Products_PriceY":"699.00","Products_PriceX":"429.00","Products_SoldOut":0,"Products_Status":1,"Products_Count":9943,"Products_Sales":28049,"Products_Weight":"2.00","Products_IsVirtual":0,"Products_IsRecieve":0,"Products_IsHot":1,"Products_IsNew":0,"Products_IsRecommend":0,"Products_IsShippingFree":0,"Products_IsPaysBalance":1,"click_count":364,"pintuan_flag":1,"pintuan_people":3,"pintuan_start_time":1574652033,"pintuan_end_time":1605110400,"pintuan_pricex":"399.00","Products_BriefDescription":"","ImgPath":"https://new401.bafangka.com/uploadfiles/wkbq6nc2kc/image/5dca53b6f9.jpg","is_pintuan":1},{"Products_ID":245,"Products_Type":0,"Products_Name":"美的（Midea）M1-L213B 快捷微波炉 360°转盘加热 旋钮操控 精准控温 五档火力 21升","Products_JSON":{"ImgPath":["https://new401.bafangka.com/uploadfiles/wkbq6nc2kc/image/5dba8f57a6.jpg","https://new401.bafangka.com/uploadfiles/wkbq6nc2kc/image/5dba8f5c36.jpg","https://new401.bafangka.com/uploadfiles/wkbq6nc2kc/image/5dba8f617f.jpg"]},"Products_PriceY":"388.00","Products_PriceX":"309.00","Products_SoldOut":0,"Products_Status":1,"Products_Count":9997,"Products_Sales":9,"Products_Weight":"1.30","Products_IsVirtual":0,"Products_IsRecieve":0,"Products_IsHot":1,"Products_IsNew":1,"Products_IsRecommend":1,"Products_IsShippingFree":1,"Products_IsPaysBalance":1,"click_count":141,"pintuan_flag":1,"pintuan_people":22,"pintuan_start_time":1574418404,"pintuan_end_time":1604073600,"pintuan_pricex":"44.00","Products_BriefDescription":"【11月1日0:00-24：00超级秒杀日，提前开抢，价保11.11】当日秒杀价299！美的微波炉，加热快，超节能，营养美味皆可得！惊喜点击 ","ImgPath":"https://new401.bafangka.com/uploadfiles/wkbq6nc2kc/image/5dba8f57a6.jpg","is_pintuan":1},{"Products_ID":537,"Products_Type":0,"Products_Name":"MAC/魅可尤雾弹唇膏哑光口红 316/923丝绒雾面新款","Products_JSON":{"ImgPath":["https://new401.bafangka.com/uploadfiles/wkbq6nc2kc/image/5dca537a32.jpg","https://new401.bafangka.com/uploadfiles/wkbq6nc2kc/image/5dca56573f.jpg"]},"Products_PriceY":"699.00","Products_PriceX":"170.00","Products_SoldOut":0,"Products_Status":1,"Products_Count":9990,"Products_Sales":300013,"Products_Weight":"1.00","Products_IsVirtual":0,"Products_IsRecieve":0,"Products_IsHot":1,"Products_IsNew":1,"Products_IsRecommend":1,"Products_IsShippingFree":0,"Products_IsPaysBalance":1,"click_count":129,"pintuan_flag":0,"pintuan_people":0,"pintuan_start_time":1573541494,"pintuan_end_time":1605110400,"pintuan_pricex":"0.00","Products_BriefDescription":"哑而不干 柔雾质地 轻烟上唇","ImgPath":"https://new401.bafangka.com/uploadfiles/wkbq6nc2kc/image/5dca537a32.jpg","is_pintuan":0},{"Products_ID":544,"Products_Type":0,"Products_Name":"华迈空气净化器","Products_JSON":{"ImgPath":["https://new401.bafangka.com/uploadfiles/wkbq6nc2kc/image/5dca5806ef.jpg","https://new401.bafangka.com/uploadfiles/wkbq6nc2kc/image/5dca580b81.jpg","https://new401.bafangka.com/uploadfiles/wkbq6nc2kc/image/5dca581014.jpg","https://new401.bafangka.com/uploadfiles/wkbq6nc2kc/image/5dca5815e2.jpg","https://new401.bafangka.com/uploadfiles/wkbq6nc2kc/image/5dca58d020.jpg"]},"Products_PriceY":"1699.00","Products_PriceX":"999.00","Products_SoldOut":0,"Products_Status":1,"Products_Count":9995,"Products_Sales":704,"Products_Weight":"20.00","Products_IsVirtual":0,"Products_IsRecieve":0,"Products_IsHot":1,"Products_IsNew":1,"Products_IsRecommend":1,"Products_IsShippingFree":0,"Products_IsPaysBalance":1,"click_count":84,"pintuan_flag":0,"pintuan_people":0,"pintuan_start_time":1573542292,"pintuan_end_time":1605110400,"pintuan_pricex":"0.00","Products_BriefDescription":"","ImgPath":"https://new401.bafangka.com/uploadfiles/wkbq6nc2kc/image/5dca5806ef.jpg","is_pintuan":0},{"Products_ID":652,"Products_Type":92,"Products_Name":"李宁跑步鞋男鞋2019新款减震早晨跑男士时尚经典低帮运动鞋","Products_JSON":{"ImgPath":["https://new401.bafangka.com/uploadfiles/wkbq6nc2kc/image/20191120202324141.jpg","https://new401.bafangka.com/uploadfiles/wkbq6nc2kc/image/20191120202326156.jpg"]},"Products_PriceY":"2222.00","Products_PriceX":"222.00","Products_SoldOut":0,"Products_Status":1,"Products_Count":1997,"Products_Sales":1001,"Products_Weight":"2.00","Products_IsVirtual":0,"Products_IsRecieve":0,"Products_IsHot":1,"Products_IsNew":1,"Products_IsRecommend":1,"Products_IsShippingFree":0,"Products_IsPaysBalance":0,"click_count":66,"pintuan_flag":0,"pintuan_people":0,"pintuan_start_time":0,"pintuan_end_time":0,"pintuan_pricex":"0.00","Products_BriefDescription":"","ImgPath":"https://new401.bafangka.com/uploadfiles/wkbq6nc2kc/image/20191120202324141.jpg","is_pintuan":0,"skujosn":{"鞋码":{"1":"30","2":"31"},"颜色":{"3":"黄色"}},"skuvaljosn":{"1;3":{"Product_Attr_ID":616,"Products_ID":652,"Attr_ID":69,"Attr_Value":{"鞋码":"30","颜色":"黄色"},"Attr_Price":242,"Supply_Price":"220.00","pt_pricex":"0.00","Property_count":998,"number_id":"","Attr_Image":""},"2;3":{"Product_Attr_ID":617,"Products_ID":652,"Attr_ID":69,"Attr_Value":{"鞋码":"31","颜色":"黄色"},"Attr_Price":242,"Supply_Price":"220.00","pt_pricex":"0.00","Property_count":999,"number_id":"","Attr_Image":"https://new401.bafangka.com/uploadfiles/wkbq6nc2kc/image/20191120202346117.jpg"}}},{"Products_ID":543,"Products_Type":0,"Products_Name":"米蓓尔净透无瑕固态闪释 补水保湿面膜哈","Products_JSON":{"ImgPath":["https://new401.bafangka.com/uploadfiles/wkbq6nc2kc/image/5dca552777.jpg","https://new401.bafangka.com/uploadfiles/wkbq6nc2kc/image/5dca55441a.jpg","https://new401.bafangka.com/uploadfiles/wkbq6nc2kc/image/5dca55597f.jpg","https://new401.bafangka.com/uploadfiles/wkbq6nc2kc/image/5dca55631b.jpg","https://new401.bafangka.com/uploadfiles/wkbq6nc2kc/image/5dca559b56.jpg"]},"Products_PriceY":"298.00","Products_PriceX":"128.00","Products_SoldOut":0,"Products_Status":1,"Products_Count":10000,"Products_Sales":19928,"Products_Weight":"1.00","Products_IsVirtual":0,"Products_IsRecieve":0,"Products_IsHot":1,"Products_IsNew":1,"Products_IsRecommend":1,"Products_IsShippingFree":1,"Products_IsPaysBalance":1,"click_count":56,"pintuan_flag":0,"pintuan_people":0,"pintuan_start_time":1573541754,"pintuan_end_time":1605110400,"pintuan_pricex":"0.00","Products_BriefDescription":"","ImgPath":"https://new401.bafangka.com/uploadfiles/wkbq6nc2kc/image/5dca552777.jpg","is_pintuan":0},{"Products_ID":541,"Products_Type":0,"Products_Name":"越南玉芒大青芒新鲜水果包邮当季整箱甜心芒应季10斤比凯特芒果好","Products_JSON":{"ImgPath":["https://new401.bafangka.com/uploadfiles/wkbq6nc2kc/image/5dca5a05b7.jpg","https://new401.bafangka.com/uploadfiles/wkbq6nc2kc/image/5dca5af750.jpg","https://new401.bafangka.com/uploadfiles/wkbq6nc2kc/image/5dca5b051f.jpg","https://new401.bafangka.com/uploadfiles/wkbq6nc2kc/image/5dca5b0f77.jpg","https://new401.bafangka.com/uploadfiles/wkbq6nc2kc/image/5dca5b1dfb.jpg"]},"Products_PriceY":"59.00","Products_PriceX":"29.90","Products_SoldOut":0,"Products_Status":1,"Products_Count":10000,"Products_Sales":12300,"Products_Weight":"10.00","Products_IsVirtual":0,"Products_IsRecieve":0,"Products_IsHot":1,"Products_IsNew":1,"Products_IsRecommend":1,"Products_IsShippingFree":0,"Products_IsPaysBalance":1,"click_count":53,"pintuan_flag":1,"pintuan_people":5,"pintuan_start_time":1573542716,"pintuan_end_time":1605110400,"pintuan_pricex":"19.90","Products_BriefDescription":"越南玉芒大青芒新鲜水果包邮当季整箱甜心芒应季10斤比凯特芒果好","ImgPath":"https://new401.bafangka.com/uploadfiles/wkbq6nc2kc/image/5dca5a05b7.jpg","is_pintuan":1}];

    @Component({
        mixins:[],
        components: {

        }
    })

    export default class StoreProductList extends Vue {

        activeName='1'
        dataTableOpt = {
            act : 'get_self_store_prod',
            dataList:false,
            page:1,
            totalCount:100,
            pageSize:10,
            is_paginate:true,//是否显示分页 默认显示
            columns : [
                {
                    prop: "Products_ID",
                    label: "产品ID",
                    align:'center',
                    width:138,
                    // sortable: true,
                    //后面这些是filter使用的
                    search: false //不需要搜索ID,所以都不需要了
                },
                {
                    prop: "Products_Name",
                    label: "商品名称",
                    value:'',
                    width:600,
                    align:'center',
                    field: "Products_Name",
                    // align: "center",
                    // sortable: true,
                    //后面这些是filter使用的
                    required: true,
                    search: {
                        type: 'input',
                        operate: 'like',
                    }
                },
                {
                    prop: "Products_PriceX",
                    label: "商品价格",
                    width:120,
                    align:'center',
                    search: false
                },
                {
                    prop: "Products_Qrcode",
                    label: "二维码",
                    align:'center',
                    width:150,
                    // showIf:(row)=>false,
                    search: false
                },
                {
                    prop: "Product_Cate",
                    label: "商品分类",
                    align:'center',
                    showIf:(row)=>false,
                    value:'',
                    search: {
                        type: 'select',
                        operate: 'like',
                        option:[]
                    }
                },
                {
                    prop: "attr",
                    label: "特殊属性",
                    align:'center',
                    width:150,
                    value:'',
                    search: {
                        option:'',
                        type: 'select',
                        operate: 'like',
                    }
                },
                {
                    prop: "Products_CreateTime",
                    label: "发布时间",
                    align:'center',
                    width:150,
                    search: false
                },
                {
                    prop: "Products_Sales",
                    label: "销量/库存",
                    align:'center',
                    width:150,
                    search: false
                },
                {
                    prop: "operate",
                    label: "操作",
                    align:'center',
                    width:150,
                    search: false
                }
            ]
        }

        settingShow=false
        settingData=[]

        cates = []

        handleClick(){
            this.getProduct()
        }
        //重置
        reset(){
            for(let it in this.dataTableOpt.columns){
                this.dataTableOpt.columns[it].value=''
            }
            this.getProduct()
        }
        //搜索
        submit(){
            this.getProduct()
        }
        goProduct(){

        }
        selectValue=[]
        //获取选中数据
        selectVal(val){
            this.selectValue=[]
            for(let item of val){
                this.selectValue.push(item.Products_ID)
            }
        }

        //一页多少行
        handleSizeChange(val){
            this.dataTableOpt.pageSize=val
            this.getProduct()
        }
        //当前页数
        currentChange(val){
            this.dataTableOpt.page=val
            this.getProduct()
        }

        getProduct(){
            let data={
                pageSize: this.dataTableOpt.pageSize,
                page:this.dataTableOpt.page,
                pro_name:this.dataTableOpt.columns[1].value,
                sel_oattr:this.dataTableOpt.columns[6].value,
                sel_cate:this.dataTableOpt.columns[5].value,
                status:this.activeName,
                store_id:24
            }

            getProducts(data).then(res=>{
                if(res.errorCode==0){
                    this.dataTableOpt.dataList=res.data
                    this.dataTableOpt.totalCount=res.totalCount
                    this.dataTableOpt.columns[6].search.option=res.oattrs
                }
            })
        }

        created(){

            this.getProduct()
            getProductCategory().then(res=>{
                let cates = res.data
                // arr2table(newArr,'Category_ID','Category_ParentID')
                this.cates = restArr(cates,'child')
                //修改
                let idx = findArrayIdx(this.dataTableOpt.columns,{prop:'Product_Cate',label:'商品分类'})
                console.log(idx)
                if(idx!==false){
                    this.dataTableOpt.columns[idx].search.option = this.cates.map(item=>{
                        return {label:item.new_name,value:item.Category_ID}
                    })
                }
            })
        }
    }
</script>
<style lang="stylus" scoped>
  .spans
    color:#428CF7
    margin-right:4px
    cursor:pointer
</style>


<style lang="less" scoped>
  .cartsDialogMask{
    background: rgba(0,0,0,.5);
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 999;
  }
  .cartsDialog{
    position: fixed;
    z-index: 1000;
    bottom: 50px;
    height: 650px;
    background: #f8f8f8;
    overflow-y: scroll;
    left: 50%;
    transform: translate(-50%);
    &::-webkit-scrollbar{
      display: none;
    }
    .carts-dialog-container{
      display: flex;
      flex-wrap: wrap;
      margin: 30px auto;

      .goods-item{
        margin-right: 15px;
        background: white;
        margin-bottom: 15px;
        padding-bottom: 6px;
        .cover{
          background-size: contain;
          background-repeat: no-repeat;
          background-position: center;
          background-color: #fff;
          cursor: pointer;
          position: relative;
          &:hover{
            .el-icon-error{
              visibility: visible;
              color: #F43131;
            }
          }
          .el-icon-error{
            visibility: hidden;
            position: absolute;
            right: -16px;
            top: -16px;
            font-size: 32px;
            color: rgba(0,0,0,.5);
          }
        }
        .title{
          font-size: 14px;
          line-height: 20px;
          height: 40px;
          overflow: hidden;
          margin: 6px 0;
          color: #333;
          padding:  0 6px;
        }
        .attr{
          font-size: 12px;
          color: #888;
          margin-bottom: 6px;
          padding:  0 6px;
        }
        .numbox{
          padding:  0 6px;
          display: flex;
          align-items: center;
          .label{
            font-size: 12px;
            padding-right: 4px;
          }
          .input{
            width: 40px;
            margin: 0 6px 0 0px;
            height: 26px;
            line-height: 26px;
            padding: 0 4px;
            border: 1px solid #C0C0C0;
            text-align: center;
          }
          .num-btns{

            .num-btn{
              display: block;
              height: 12px;
              width: 16px;
              border: 1px solid #C0C0C0;
              position: relative;
              font-size: 14px;
              text-align: center;
              cursor: pointer;
              &.plus-btn{
                /*position: absolute;*/
                /*bottom: 0;*/
                /*vertical-align: middle;*/
                .el-icon-arrow-up{
                  position: absolute;
                  bottom: -2px;
                  left: 50%;
                  transform: translateX(-50%);
                }

              }
              &.minus-btn{
                margin-top: 2px;

                .el-icon-arrow-down{
                  position: absolute;
                  top: -1px;
                  left: 50%;
                  transform: translateX(-50%);
                }
                /*position: absolute;*/
                /*top: 0;*/
              }
            }
          }
        }
      }

    }
  }
  .page-wrap{
    position: relative;
    width:100%;
    height: 100vh;
    overflow: hidden;
    overflow-y: scroll;
    background: #f8f8f8;
    &::-webkit-scrollbar{
      display: none;
    }
    /*background-position:center bottom;*/
    /*background-size:100% auto;*/
    /*background-repeat:no-repeat;*/
    /*background-image:url("~@/assets/img/store/join_bg.png");*/
  }

  .dialog-container{
    .row{
      display: flex;
      margin-bottom: 10px;
      *{
        user-select: none;
      }
      .label{
        display: inline-block;
        padding-right: 10px;
        width: 60px;
        height: 30px;
        line-height: 30px;
        text-align: right;

      }
      .specs{
        flex: 1;
        .spec-item{
          position: relative;
          display: inline-block;
          margin: 0 10px 5px 0;
          height: 30px;
          width: 50px;
          line-height: 30px;
          text-align: center;
          border: 1px solid #e7e7e7;
          overflow: hidden;
          cursor: pointer;

          .el-icon-check{
            display: none;
          }
          &.use:hover{
            background: #f2f2f2;
          }
          &.disabled{
            background: #f8f8f8 !important;
            cursor: not-allowed !important;
          }
          &.choose{
            .fill{
              background: #F43131;
              position: absolute;
              right: -13px;
              bottom: -12px;
              width: 26px;
              height: 26px;
              transform: rotate(45deg);
            }
            .el-icon-check{
              font-size: 12px;
              position: absolute;
              z-index: 2;
              right: 0;
              bottom: 0;
              color: white;
              display: inline-block;
            }
          }

        }
      }
    }
  }


  @media screen and (max-width: 1200px) {
    .container-wrap{
      width:1000px;
    }
    .main{
      width: 905px;
      .item:nth-child(4n+4){
        margin-right: 0px !important;
      }
    }
    .foot{
      width:1000px;
    }
    .cartsDialog{
      width:1000px;
      .carts-dialog-container{
        width:960px;
        .goods-item{
          width: 225px;
          .cover{
            width: 225px;
            height: 196px;
          }
        }
        .goods-item:nth-child(4n+4){
          margin-right: 0px !important;
        }
      }

    }
  }
  @media screen and (min-width: 1200px) and (max-width: 1660px) {
    .container-wrap{
      width:1200px;
    }
    .main{
      width: 1135px;
      .item:nth-child(5n+5){
        margin-right: 0px !important;
      }
    }
    .foot{
      width:1200px;
    }
    .cartsDialog{
      width:1200px;
      .carts-dialog-container{
        width:1160px;
        .goods-item{
          width: 220px;
          .cover{
            width: 220px;
            height: 194px;
          }
        }
        .goods-item:nth-child(5n+5){
          margin-right: 0px !important;
        }
      }
    }
  }
  @media screen and (min-width: 1660px) {
    .container-wrap{
      width:1634px;
    }
    .main{
      width: 1365px;
      .item:nth-child(6n+6){
        margin-right: 0px !important;
      }
    }
    .foot{
      width:1634px;
    }
    .cartsDialog{
      width:1634px;
      .carts-dialog-container{
        width:1595px;
        .goods-item{
          width: 215px;
          .cover{
            width: 215px;
            height: 188px;
          }
        }
        .goods-item:nth-child(7n+7){
          margin-right: 0px !important;
        }
      }
    }
  }

  .container-wrap{

    height: 100%;
    margin: 0 auto 50px;
    background: white;

  }

  .main{

    margin: 0 auto 50px;
    padding-bottom: 30px;
    .lists{
      display: flex;
      flex-wrap: wrap;

      .item{
        margin-right: 15px;
        width: 215px;
        cursor: pointer;
        padding-bottom: 10px;
        border: 1px solid #e7e7e7;
        box-sizing: border-box;
        margin-bottom: 15px;
        &:hover{
          .cover{
            .mask{
              visibility: visible;
            }
            .tip{
              visibility: visible;
            }
          }

        }
        .cover{
          margin: 5px;
          width: 205px;
          height: 205px;
          position: relative;
          border-radius: 2px;
          overflow: hidden;
          .thumb{
            width: 100%;
            height: 100%;
            background-repeat: no-repeat;
            background-size: contain;
            background-color: #f2f2f2;
            background-position: center;
          }
          /*.mask{*/
          /*  position: absolute;*/
          /*  left: 0;*/
          /*  right: 0;*/
          /*  bottom: 0;*/
          /*  top: 0;*/
          /*  background: linear-gradient(rgba(0,0,0,.1),rgba(0,0,0,.6));*/
          /*  z-index: 2;*/
          /*  visibility: hidden;*/
          /*}*/
          .tip{
            position: absolute;
            z-index: 3;
            background: rgba(244, 49, 49,.7);
            color: white;
            bottom: 0;
            left: 0;
            right: 0;
            height: 20px;
            font-size: 12px;
            line-height: 20px;
            text-align: center;
            visibility: hidden;
          }
        }
        .title{
          height: 42px;
          font-size: 14px;
          line-height: 21px;
          overflow: hidden;
          padding-left: 10px;
          padding-right: 10px;
        }
        .price-box{
          padding-left: 10px;
          padding-right: 10px;
        }
        .sales{
          padding-left: 10px;
          padding-right: 10px;
          color: #999;
          font-size: 12px;
        }
      }
    }
  }

  .foot{
    position: fixed;
    z-index: 1001;
    box-shadow: 0 0  16px 0px rgba(0,0,0,.3);
    bottom: 0;
    height: 50px;
    left: 50%;
    transform: translateX(-50%);
    background: white;
    .count{
      margin: 0 auto;
      text-align: center;
      line-height: 50px;
      color: #333;
      .text{
        height: 50px;
        line-height: 50px;
      }

    }
    .sub-btn{
      position: absolute;
      right: 0;
      bottom: 0;
      color: white;
      background: #F43131;
      line-height: 50px;
      height: 50px;
      width: 150px;
      text-align: center;
      border-radius: 0;
      border: none;
      padding: 0;


    }
  }

  .head{
    padding: 44px 0 40px;
    margin: 0 auto;
    .search{
      width: 600px;
      height: 36px;
      line-height: 36px;
      margin: 0 auto;
      border-radius: 2px;
      overflow: hidden;
      display: flex;
      border: 1px solid #F43131;
      align-items: center;
    }
    .search-input{
      flex: 1;
      height: 36px;
      padding: 8px 20px;
      outline:none;
      border: none;
      box-sizing: border-box;
      font-size: 14px;
      line-height: 20px;
      color: #444;
      &::placeholder{
        color: #C1C1C1;
      }
    }
    .el-icon-close{
      margin-right: 6px;
      cursor: pointer;
      color: #999;
      /*position: absolute;*/
      /*right: 76px;*/
    }
    .search-btn{
      height: 36px;
      width: 74px;
      color: white;
      background: #F43131;
      border: none;
      padding: 0;
      margin: 0;
      cursor: pointer;
    }
  }

</style>
