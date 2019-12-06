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

<!--        <div class="foot">-->
<!--          <div class="count" style="cursor: pointer">-->
<!--            &lt;!&ndash;          /{{paginate.totalCount}}&ndash;&gt;-->
<!--            <div class="text">-->
<!--              <span @click="cartDialogOpen"  v-show="!cartsDialogInstance.innerVisible">已选取<span class="danger-color">{{count_num}}</span>个普通商品</span>-->
<!--              <span @click="cartDialogCancel" v-show="cartsDialogInstance.innerVisible">已选取<span class="danger-color">{{count_num}}</span>个普通商品</span>-->
<!--              <i @click="cartDialogOpen"  v-show="!cartsDialogInstance.innerVisible" class="el-icon-arrow-up"></i>-->
<!--              <i @click="cartDialogCancel" v-show="cartsDialogInstance.innerVisible" class="el-icon-arrow-down"></i>-->
<!--            </div>-->
<!--          </div>-->
<!--          <el-button class="sub-btn" @click="subFn" v-loading="subLoading">提交进货单</el-button>-->
<!--        </div>-->
<!--        <div id="imgs"></div>-->


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

    import {Cart} from '../common/cart';
    import {fun} from '../common';

    const cartInstance = new Cart()

    @Component({
        mixins:[],
        components: {

        },
        computed:{
            count_num(){
                return cartInstance.getLen()
            },
        }
    })

    export default class StoreProductList extends Vue {

        carts = cartInstance

        cartsDialogInstance = {
            innerVisible:false,
            loading:false
        }

        cartDialogOpen(){
            // document.body.className += 'el-popup-parent--hidden'
            // document.body.style.PaddingRight = '17px'
            this.cartsDialogInstance.innerVisible = true
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

            let nameIdx = findArrayIdx(this.dataTableOpt.columns,{prop:'Products_Name'})
            let oattrIdx = findArrayIdx(this.dataTableOpt.columns,{prop:'attr'})
            let cateIdx = findArrayIdx(this.dataTableOpt.columns,{prop:'Product_Cate'})

            let data={
                pageSize: this.dataTableOpt.pageSize,
                page:this.dataTableOpt.page,
                pro_name:this.dataTableOpt.columns[nameIdx].value,
                sel_oattr:this.dataTableOpt.columns[oattrIdx].value,
                sel_cate:this.dataTableOpt.columns[cateIdx].value,
                status:this.activeName,
                store_id:24
            }


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
