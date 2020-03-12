<template>
  <div class="home-wrap">
    <div style="padding: 20px">
      <!--      get_self_store_prod-->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="出售中" name="1"></el-tab-pane>
        <el-tab-pane label="已售完" name="2"></el-tab-pane>
<!--        <el-tab-pane label="已下架" name="3"></el-tab-pane>-->
      </el-tabs>
      <div class="padding10">
        <el-button  size="mini" class="" :type="cartsDialogInstance.backText=='退货'?'primary':'default'" @click="openBackFn">{{cartsDialogInstance.backText}}</el-button>
      </div>
      <fun-table
        :columns="dataTableOpt.columns"
        :dataList="dataTableOpt.dataList"
        :_totalCount="dataTableOpt.totalCount"
        :_pageSize="dataTableOpt.pageSize"
        :isSelect="false"
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
            <img :class="'item'+props.idx" width="90px" height="100px" :src="props.row.img_url">
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
          <div class="skuClass" @click="lookSku(props.row.Products_ID)" v-if="props.row.Products_Type!=0">规格库存</div>
        </template>
        <template slot="operate-column" slot-scope="props">
          <span v-if="cartsDialogInstance.footVisible" class="spans" @click="openDialog(props.row,props.idx)">退货</span>
        </template>
      </fun-table>
    </div>

    <div id="imgs"></div>

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

    <div class="foot noselect" v-show="cartsDialogInstance.footVisible">
      <div class="count" style="cursor: pointer" @click="cartDialogOpen">
        <!--          /{{paginate.totalCount}}-->
        <div class="text">
          <span   v-show="!cartsDialogInstance.innerVisible">已选取<span class="danger-color">{{count_num}}</span>个商品</span>
          <span  v-show="cartsDialogInstance.innerVisible">已选取<span class="danger-color">{{count_num}}</span>个商品</span>
          <i   v-show="!cartsDialogInstance.innerVisible" class="el-icon-arrow-up"></i>
          <i  v-show="cartsDialogInstance.innerVisible" class="el-icon-arrow-down"></i>
        </div>
      </div>
      <el-button class="sub-channel" @click="changeChannel" >退货渠道<span v-if="channelDialogInstance.channel">:{{channelDialogInstance.channel=='shop'?'平台':'门店'}}</span><i class="el-icon-arrow-up"></i></el-button>
      <el-button class="sub-btn" @click="subBackFn" v-loading="subLoading">确认退货</el-button>
    </div>

    <div @click="cartDialogCancel" class="cartsDialogMask"  @mousewheel.prevent  v-show="cartsDialogInstance.innerVisible"></div>
    <div class="cartsDialog" v-show="cartsDialogInstance.innerVisible"  v-loading="cartsDialogInstance.loading">
      <div class="carts-dialog-container" v-if="carts.lists.length>0" >
        <div class="goods-item" v-for="(goods,idx) of carts.lists" :key="idx"  >
          <div class="cover" :style="{backgroundImage: 'url('+goods.img_url+')'}"><i @click="cartRemoveFn(goods)" class="el-icon-error"></i></div>
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
        <div class="padding10-r graytext text-center">空空如也</div>
      </div>
      <span slot="footer" class="dialog-footer"></span>
    </div>

    <el-dialog
      :visible.sync="dialogInstance.innerVisible"
      title="选择商品属性"
      width="500px"
      center
      @close="dialogCancel"
      class="innerDislog"
    >
      <div class="dialog-container"  >
        <div class="row" v-for="(item,idx1) of dialogInstance.product.skujosn_new" :key="idx1" >
          <span class="label">{{item.sku}}:</span>
          <div class="specs">
            <div class="spec-item" :class="getClassFn(idx1,idx2)"  @click="selectAttr(item.sku,spec,idx1,idx2)"  v-for="(spec,idx2) of item.val" :key="idx2">
              {{spec}}
              <i class="el-icon-check"></i>
              <div class="fill"></div>
            </div>
          </div>
        </div>
        <div class="row">
          <span class="label">数量:</span>
          <div class="specs">
            <el-input-number controls-position="right" :min="1" :max="dialogInstance.stock" size="small" v-model="dialogInstance.num" :step="1"></el-input-number>
            <span class="font12 graytext2 padding10-c">最多可以选择{{dialogInstance.stock}}件</span>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
                <el-button @click="dialogCancel">取 消</el-button>
                <el-button @click="dialogSub" style="background: #F43131;color:white" >确 定</el-button>
            </span>
    </el-dialog>

    <el-dialog
      :visible.sync="channelDialogInstance.innerVisible"
      title="切换渠道"
      width="848px"
      center
      @close="channelDialogCancel"

      class="channel-container-wrap"
    >
      <div class="">
        <el-form label-width="100px" class="form">
          <el-form-item label="退货渠道:" prop="channel">
            <el-select  v-model="channelDialogInstance.channel" placeholder="请选择类型" style="width: 100%" >
              <template v-for="(item,idx) of channelDialogInstance.channels">
                <el-option :label="item.name" :value="item.val" :key="item.val" ></el-option>
              </template>
            </el-select>
          </el-form-item>
          <el-form-item label=" " prop="store_no" v-show="channelDialogInstance.channel!='shop'">
            <div class="flex">
              <el-input  v-model="channelDialogInstance.store_no" placeholder="请输入门店编码" ></el-input>
              <div class="w10"></div>
              <el-button @click="dialogStoreShow=true">筛选门店</el-button>
            </div>
          </el-form-item>
        </el-form>
        <div class="btn" @click="changeBackChannel">确定</div>
      </div>

    </el-dialog>

    <bind-store-component
      top="15vh"
      @cancel="bindStoreCancel"
      @success="bindStoreSuccessCall"
      :single="true"
      :get_top="1"
      :self_store_id="self_store_id"
      :show="dialogStoreShow"
    />


    <el-dialog title="规格库存" :visible.sync="skuShow" top="300px" width="40%">
      <el-table :data="skuList">
        <el-table-column property="attr_txt" label="规格" ></el-table-column>
        <el-table-column property="count" label="库存" ></el-table-column>
        <el-table-column property="price" label="价格"></el-table-column>
      </el-table>
    </el-dialog>
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
    import BindStoreComponent from '../components/comm/BindStoreComponent'
    import {
        getProducts,
        batchSetting,
        getProductCategory,
        delProduct,
        storeProductBack,
        getStoreDetail,
        getProductAtts,
        getShippingTemplate
    } from '@/common/fetch';
    import {findArrayIdx, plainArray, createTmplArray, objTranslate,compare_obj} from '@/common/utils';
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

    import {Cart} from '../common/cart';
    import {fun} from '../common';
    import {Fly} from '../common/UnitBezier';

    import Cookies from 'js-cookie';
    const Stores_ID = Cookies.get('Stores_ID')
    const User_ID = Cookies.get('Stores_Bind_User_ID')


    const cartInstance = new Cart()

    @Component({
        mixins:[],
        components: {
            BindStoreComponent
        },
        computed:{
            count_num(){
                return cartInstance.getLen()
            },
        }
    })

    export default class StoreProductList extends Vue {


        self_store_id = Cookies.get('Stores_ID')
        dialogStoreShow = false

        bindStoreCancel(){
            this.dialogStoreShow = false
        }
        bindStoreSuccessCall(store_info){

            console.log(store_info)
            if(store_info && store_info.hasOwnProperty('stores_sn')){
                this.channelDialogInstance.store_no = store_info.stores_sn
                this.dialogStoreShow = false
            }else{
                fun.error({msg:'店铺选择错误'})
            }

        }

        skuList=[]
        skuShow=false
        lookSku(id){
            this.skuShow=true
            let data={
                store_id:this.self_store_id,
                product_id:id
            }
            getProductAtts(data).then(res=>{
                if(res.errorCode==0){
                    this.skuList=res.data
                }
            })
        }

        fly_img_url = ''
        curPosX = 0
        curPosY = 0
        lastPosX = 0
        lastPosY = 0
        isMove = false


        stores = []

        channelDialogInstance = {
            apply:null,
            store_no:null,
            channel:1,
            channels:[{id:1,name:'门店',val:'store'}, {id:2,name:'平台',val:'shop'}],
            innerVisible:false,
            store_sn:''
        }

        //getProductAtts


        changeBackChannel(){

            if(!this.channelDialogInstance.channel){
                fun.error({msg:'渠道必选'});
                return;
            }
            if(this.channelDialogInstance.channel==='store' && !this.channelDialogInstance.store_no){
                fun.error({msg:'门店编码必填'});
                return;
            }

            this.channelDialogCancel()

            // this.subBackFn()

            // let postData = {purchase_type:this.channelDialogInstance.channel,order_id:this.channelDialogInstance.apply.Order_ID}
            //
            // if(this.channelDialogInstance.channel==='store'){
            //     this.channelDialogInstance.store_sn = this.channelDialogInstance.store_no
            // }

            // changeStoreApplyChannel(postData).then(res=>{
            //     this.channelDialogCancel()
            // })
        }

        channelDialogCancel(){
            this.channelDialogInstance.innerVisible = false
            // this.channelDialogInstance.store_no = null
            // this.channelDialogInstance.channel = null

        }

        changeChannel(apply){

            this.channelDialogInstance.innerVisible = true
        }


        dialogInstance = {
            innerVisible:false,
            loading:false,
            num:0,
            check_attr:[],
            skuval:{},
            product:{},
            item:null,
            stock:0,
            idx:0,
            addCartReq:false,
            prd_attr_id:null//记录最终选出的attrid
        }

        subBackFn(){

            let postData = {}
            let prod_attr = {}
            for(var goods of this.carts.lists){
                if(goods.num<1){
                    fun.error({msg:'产品至少选择1个'})
                    return;
                }
                console.log(goods,prod_attr.hasOwnProperty(goods.Products_ID))
                if(!prod_attr.hasOwnProperty(goods.Products_ID) || typeof prod_attr[goods.Products_ID]!='object'){
                    prod_attr[goods.Products_ID] = {num:goods.num}
                }else{
                    prod_attr[goods.Products_ID].num+= goods.num //总量
                }

                console.log(prod_attr[goods.Products_ID])
                if(goods.prd_attr_id){
                    if(!prod_attr[goods.Products_ID].hasOwnProperty('attr') || typeof prod_attr[goods.Products_ID].attr!='object'){
                        prod_attr[goods.Products_ID].attr = {}
                    }
                    prod_attr[goods.Products_ID].attr[goods.prd_attr_id] = goods.num
                }else{
                    //prod_attr[goods.Products_ID] = []
                }
            }
            postData.prod_json = JSON.stringify(prod_attr)

            if(!this.channelDialogInstance.channel){
                fun.error({msg:'退货渠道必填'})
                return;
            }


            // && this.channelDialogInstance.store_no已经检查过了
            if(this.channelDialogInstance.channel === 'store'){
                if(!this.channelDialogInstance.store_no){
                    fun.error({msg:'选择门店退货，门店编号必填'})
                    return;
                }
                postData.purchase_type = 'store'
                postData.purchase_store_sn = this.channelDialogInstance.store_no
            }else{
                postData.purchase_type = 'shop'
            }



            console.log(postData)
            storeProductBack(postData,{text:'提交退货请求'}).then(res=>{

                cartInstance.clear()
                fun.success({msg:'发起退货成功'})
                this.openBackFn()
                this.cartDialogCancel()
                this.getProduct()

            }).catch(e=>{

            })
        }
        //直接赋值了
        selectAttr(val1,val2,idx1,idx2){

            //是否禁用
            let classObj = this.getClassFn(idx1,idx2)
            if(classObj.disabled)return;


            this.$set(this.dialogInstance.skuval,val1,val2)

            let count = 0;
            for(var key in this.dialogInstance.product.skuvaljosn){
                //看是不是已经选中的属性在数组二中存在,只要存在一个，就不会是禁用的
                //而且要有库存
                if(compare_obj(this.dialogInstance.skuval,this.dialogInstance.product.skuvaljosn[key].Attr_Value) && this.dialogInstance.product.skuvaljosn[key].Property_count>0){

                    //正反来一下，就行了
                    if(compare_obj(this.dialogInstance.product.skuvaljosn[key].Attr_Value,this.dialogInstance.skuval)){
                        this.dialogInstance.prd_attr_id = this.dialogInstance.product.skuvaljosn[key].Product_Attr_ID
                    }
                    //累计可用库存
                    count += this.dialogInstance.product.skuvaljosn[key].Property_count
                }
            }

            this.dialogInstance.stock = count

            //数量太大就重置为1
            if(this.dialogInstance.num>count){
                this.dialogInstance.num = 1
            }

        }

        getClassFn(idx1,idx2){

            if(JSON.stringify(this.dialogInstance.product) == '{}')return {};



            let disabled = true;
            let count = 0;

            //没有这个属性，也就是还没有选中这一行
            // console.log(this.dialogInstance.product.skujosn_new[idx1].sku)
            // if(!this.dialogInstance.skuval.hasOwnProperty(this.dialogInstance.product.skujosn_new[idx1].sku)){
            //
            //
            // }else{
            //     disabled = false;
            // }

            let spec_info = {[this.dialogInstance.product.skujosn_new[idx1].sku]:this.dialogInstance.product.skujosn_new[idx1].val[idx2]};
            // console.log(spec_info)

            //模拟一下，如果现有的规格加上现在这个，还能有数量。那么就可以被选中
            //直接用自己的属性覆盖上去，如果有同样一行的，就覆盖掉
            let tempSkuVal = Object.assign({},this.dialogInstance.skuval,spec_info)

            for(var key in this.dialogInstance.product.skuvaljosn){
                //看是不是已经选中的属性在数组二中存在,只要存在一个，就不会是禁用的
                //而且要有库存
                if(compare_obj(tempSkuVal,this.dialogInstance.product.skuvaljosn[key].Attr_Value) && this.dialogInstance.product.skuvaljosn[key].Property_count>0){
                    disabled = false;
                    //累计可用库存
                    count += this.dialogInstance.product.skuvaljosn[key].Property_count
                }
            }



            //是否选中
            let choose = false
            if(this.dialogInstance.skuval.hasOwnProperty(this.dialogInstance.product.skujosn_new[idx1].sku)){
                if(this.dialogInstance.skuval[this.dialogInstance.product.skujosn_new[idx1].sku] === this.dialogInstance.product.skujosn_new[idx1].val[idx2])choose=true
            }

            let use = !disabled
            return {choose,disabled,use}
        }


        async dialogSub(){

            if(this.dialogInstance.product.skujosn_new.length>0 && Object.keys(this.dialogInstance.skuval).length != Object.keys(this.dialogInstance.product.skujosn).length){
                fun.error({msg:'请选择所有规格'})
                return;
            }

            if(this.dialogInstance.product.skujosn_new.length>0 && !this.dialogInstance.prd_attr_id){
                fun.error({msg:'商品规格数据错误'})
                return;
            }

            //也要把prd_attr_id写进去
            let target = Object.assign({},this.dialogInstance.item,this.dialogInstance.product,{prd_attr_id:this.dialogInstance.prd_attr_id,num:this.dialogInstance.num})
            // console.log('targettargettargettargettargettarget',target)
            target.skuval = this.dialogInstance.skuval
            target.speck_key = this.dialogInstance.skuval


            // let select_store_id = 0

            //如果有门店，需要换成从门店进货
            // if(this.$route.query.store_no && this.products.length>0){
            //     select_store_id = this.products[0].Stores_ID
            // }

            // let postData = {
            //     cart_key:'CartList',
            //     active:'store_pifa',
            //     prod_id:this.dialogInstance.product.Products_ID,
            //     qty:this.dialogInstance.num,
            //     active_id: `${Stores_ID}_${select_store_id}`
            // }
            //
            if(this.dialogInstance.product.skujosn_new.length>0 && this.dialogInstance.prd_attr_id){
                //postData.attr_id = this.dialogInstance.prd_attr_id

                let tempStr = ''
                for(var key in this.dialogInstance.skuval){
                    if(tempStr!==''){
                        tempStr += ','
                    }
                    tempStr += key
                    tempStr += ';'
                    tempStr += this.dialogInstance.skuval[key]
                }
                target.Productsattrstrval = tempStr
            }
            // let add_card_rt = false
            //
            // this.dialogInstance.addCartReq = true
            // await updateCart(postData).then(res=>{
            //     add_card_rt = true
            //     this.dialogInstance.addCartReq = false
            // },err=>{
            //     this.dialogInstance.addCartReq = false
            // })
            //
            // if(!add_card_rt)return;

            this.dialogInstance.loading = false
            this.dialogInstance.innerVisible = false

            this.addCart(target,this.dialogInstance.idx)

        }

        addCart(goods,idx){

            if(this.isMove){
                fun.error({msg:'操作太快'})
                return;
            }
            //添加
            if(!cartInstance.add(goods))return;

            console.log(goods)
            this.fly_img_url = goods.img_url
            this.isMove = true
            let _self = this

            let randId = Date.now()+goods.Products_ID
            let eleStr = `<img src="${goods.img_url}" class="fly-pic" id="${randId}" style="{left:${this.curPosX}px,top:${this.curPosY}px}" />`

            let imgs = document.getElementById('imgs')
            imgs.innerHTML += eleStr;

            let itemDom = document.querySelector('.item'+idx)
            var rect = itemDom.getBoundingClientRect()
            console.log(rect)

            //document.body.className += 'el-popup-parent--hidden'

            let handle = document.querySelector('.foot')
            let preBoundingClientRect = handle.getBoundingClientRect()
            console.log(preBoundingClientRect)
            this.lastPosY = preBoundingClientRect.top
            this.lastPosX = document.body.offsetWidth/2


            let opt = {
                start:{left:rect.left,top:rect.top,height:100,width:100},
                end:{left:this.lastPosX,top:this.lastPosY,height:10,width:10},
                onEnd:function(){
                    console.log('endend')
                    //删掉
                    imgs.removeChild(document.getElementById(randId))
                    _self.isMove = false
                }
            }
            let fly = new Fly(randId,opt)
            //this.flys.push(fly)
        }

        cartCurrentItem = null

        cartPlusFn(goods,num){
            this.setCartCurrentItem(goods)
            if(goods.prd_attr_id){
                if(num+1>this.cartCurrentItem.sku_stock[goods.prd_attr_id]){
                    fun.error({msg:'库存已达最大值'});
                    return;
                }
            }else{
                if(num+1>this.cartCurrentItem.Products_Count){
                    fun.error({msg:'库存已达最大值'});
                    return;
                }
            }

            this.cartNumChange(num+1,num)
        }

        cartMinusFn(goods,num){
            if(num<2){
                fun.error({msg:'最少选择1个'})
                return
            }
            this.setCartCurrentItem(goods)
            this.cartNumChange(num-1,num)
        }
        setCartCurrentItem(goods){
            console.log(goods)
            this.cartCurrentItem = goods
        }
        async cartNumChange(nVal,oVal){

            let select_store_id = 0

            //如果有门店，需要换成从门店进货
            // if(this.$route.query.store_no && this.products.length>0){
            //     select_store_id = this.products[0].Stores_ID
            // }
            //
            // let postData = {
            //     cart_key:'CartList',
            //     active:'store_pifa',
            //     prod_id:this.cartCurrentItem.Products_ID,
            //     qty:(nVal-oVal),
            //     active_id: `${Stores_ID}_${select_store_id}`
            // }
            //
            // if(this.cartCurrentItem.Productsattrstrval){
            //     if(!this.cartCurrentItem.prd_attr_id){
            //         fun.error({msg:'prd_attr_id缺失'});
            //         return;
            //     }
            //     postData.attr_id = this.cartCurrentItem.prd_attr_id
            // }

            // let add_card_rt = false


            // this.cartsDialogInstance.loading = true
            // await updateCart(postData).then(res=>{
            //     add_card_rt = true
            //     this.cartsDialogInstance.loading = false
            //     this.cartCurrentItem.num = nVal
            // },err=>{
            //     this.cartsDialogInstance.loading = false
            // })
            //
            // if(!add_card_rt)return;

            this.cartCurrentItem.num = nVal

        }

        async cartRemoveFn(goods){
            // let postData = {cart_key:'CartList'}

            // let prod_attr = {}
            // if(goods.prd_attr_id){
            //
            //     prod_attr[goods.Products_ID] = [goods.prd_attr_id]
            //
            // }else{
            //     prod_attr[goods.Products_ID] = []
            //
            // }
            // postData.prod_attr = JSON.stringify(prod_attr)
            // console.log(goods,postData)
            // let del_rt =false
            // this.cartsDialogInstance.loading = true
            // await delCart(postData).then(res=>{
            //     del_rt = true
            //     this.cartsDialogInstance.loading = false
            // },err=>{
            //     this.cartsDialogInstance.loading = false
            // })
            // if(!del_rt)return;
            let {Productsattrstrval,Products_ID} = goods
            // console.log({Productsattrstrval,Products_ID})
            console.log(goods)
            cartInstance.remove(goods)
        }

        // delProductFn(){
        //     this.openDialog(goods,idx)
        // }


        async openDialog(goods,idx){

            this.dialogInstance.innerVisible = true
            this.dialogInstance.item = goods
            this.dialogInstance.idx = idx

            let product = {}
            this.dialogInstance.loading = true

            product = goods;
            if(goods.skujosn) {
                let skujosn = goods.skujosn;
                let skujosn_new = [];
                for (let i in goods.skujosn) {
                    skujosn_new.push({
                        sku: i,
                        val: skujosn[i]
                    });
                }

                product.skujosn_new = skujosn_new;
                product.skuvaljosn = goods.skuvaljosn;
            }else{
                product.skujosn_new = []
                product.skuvaljosn = ''
            }

            //库存
            this.dialogInstance.stock = product.Products_Count
            this.dialogInstance.product = product
            this.dialogInstance.innerVisible = true

            this.dialogInstance.loading = false

        }

        dialogCancel(){
            this.dialogInstance.loading = false
            this.dialogInstance.innerVisible = false
            this.dialogInstance = objTranslate({
                innerVisible:false,
                loading:false,
                num:0,
                check_attr:[],
                skuval:{},
                product:{},
                item:null,
                stock:0,
                idx:0
            })
        }


        carts = cartInstance

        cartsDialogInstance = {
            innerVisible:false,
            footVisible:false,
            backText:'退货',
            loading:false
        }


        openBackFn(){
            this.cartsDialogInstance.footVisible = !this.cartsDialogInstance.footVisible
            this.cartsDialogInstance.backText = this.cartsDialogInstance.footVisible?'取消退货':'退货'
        }

        cartDialogOpen(){
            // document.body.className += 'el-popup-parent--hidden'
            // document.body.style.PaddingRight = '17px'
            this.cartsDialogInstance.innerVisible = !this.cartsDialogInstance.innerVisible
        }

        cartDialogCancel(){

            // let bodyClassName = document.body.className
            // document.body.style.PaddingRight = '0px'
            // document.body.className = bodyClassName.replace(/el-popup-parent--hidden/,' ')
            this.cartsDialogInstance.innerVisible = false
        }

        subLoading = false

        subFn(){

            if(this.carts.lists.length<1){
                fun.error({msg:'购物车中无产品'})
                return;
            }
            let postData = {cart_key:'CartList'}
            let prod_attr = {}
            for(var goods of this.carts.lists){
                if(goods.num<1){
                    fun.error({msg:'产品至少选择1个'})
                    return;
                }
                if(goods.prd_attr_id){
                    prod_attr[goods.Products_ID] = [goods.prd_attr_id]
                }else{
                    prod_attr[goods.Products_ID] = []
                }
            }
            postData.cart_buy = JSON.stringify(prod_attr)

            this.subLoading = true
            createOrder(postData).then(res=>{
                fun.success({msg:'提交成功'})
                this.cartDialogCancel()
                this.carts.clear()
                this.subLoading = false

                this.$router.push({
                    name:'StorePurchaseApply'
                })
            },err=>{
                this.subLoading = false
            })
        }

        activeName='1'
        dataTableOpt = {
            act : 'get_self_store_prod',
            dataList:[],
            page:1,
            totalCount:0,
            pageSize:10,
            is_paginate:true,//是否显示分页 默认显示
            columns : [
                {
                    prop: "Products_ID",
                    label: "产品ID",
                    align:'center',
                    width:70,
                    // sortable: true,
                    //后面这些是filter使用的
                    search: false //不需要搜索ID,所以都不需要了
                },
                {
                    prop: "Products_Name",
                    label: "商品名称",
                    value:'',
                    width:400,
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
                    align:'center',
                    search: false
                },
                {
                    prop: "Products_Qrcode",
                    label: "二维码",
                    align:'center',
                    width:100,
                    // showIf:(row)=>false,
                    search: false
                },
                {
                    prop: "express_show",
                    label: "物流方式",
                    align:'center',
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
                    value:'',
                    search: {
                        option:'',
                        type: 'select',
                        operate: 'like',
                    }
                },
                {
                    prop: "logistics",
                    label: "物流方式筛选",
                    align:'center',
                    width:150,
                    value:'',
                    showIf:(row)=>false,
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

                    search: false
                },
                {
                    prop: "Products_Sales",
                    label: "销量/库存",
                    align:'center',
                    search: false
                },
                {
                    prop: "operate",
                    label: "操作",
                    align:'center',
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

            let nameIdx = findArrayIdx(this.dataTableOpt.columns,{prop:'Products_Name'})
            let oattrIdx = findArrayIdx(this.dataTableOpt.columns,{prop:'attr'})
            let cateIdx = findArrayIdx(this.dataTableOpt.columns,{prop:'Product_Cate'})
            let oattrIdxs = findArrayIdx(this.dataTableOpt.columns,{prop:'logistics'})

            let data={
                store_id:Stores_ID,
                pageSize: this.dataTableOpt.pageSize,
                page:this.dataTableOpt.page,
                pro_name:this.dataTableOpt.columns[nameIdx].value,
                sel_oattr:this.dataTableOpt.columns[oattrIdx].value,
                sel_cate:this.dataTableOpt.columns[cateIdx].value,
                status:this.activeName
            }
            getShippingTemplate().then(res=>{
                let datas=res.data
                for(let item of datas){
                    item.label=item.Template_Name
                    item.value=item.Template_ID
                }
                datas.push({label:'固定运费',value:'-1'})
                this.dataTableOpt.columns[oattrIdxs].search.option=datas
            })


            getProducts(data).then(res=>{
                this.dataTableOpt.dataList=res.data
                this.dataTableOpt.totalCount=res.totalCount

                this.dataTableOpt.columns[oattrIdx].search.option= res.oattrs
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

            getStoreDetail({store_id:this.self_store_id}).then(res=>{
                //去掉平台
                !res.data.allow_from_plat && this.channelDialogInstance.channels.splice(1)
            })

        }

        mounted(){
            this.$nextTick().then(()=>{


            })
        }
    }
</script>
<style lang="stylus" scoped>
  .channel-container-wrap
    box-shadow 0 0 49px 14px rgba(0, 37, 157, 0.15)
    .container-wrap
      padding-bottom 20px
    .form
      margin 30px 245px 100px 147px
    .btn
      margin 0 auto
      width 420px
      height 50px
      line-height 50px
      background #F43131
      border-radius 6px
      color white
      text-align center
      font-size 18px
      cursor pointer
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
          min-width: 50px;
          padding: 0 2px;
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
            color: #ccc;
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
    .sub-channel{
      position: absolute;
      right: 150px;
      bottom: 0;
      color: white;
      background: #909399;
      line-height: 50px;
      height: 50px;
      width: 150px;
      text-align: center;
      border-radius: 0;
      border: none;
      padding: 0;
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

  .skuClass{
    color: #409EFF;
    cursor: pointer;
  }
</style>
