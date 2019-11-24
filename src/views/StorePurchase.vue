<template>
  <div class="page-wrap">
    <div class="container-wrap">
      <div class="head">
        <div class="search">
          <input class="search-input" v-model="keyword" placeholder="请输入商品关键词" />
          <button @click="searchFn" class="search-btn">搜索</button>
        </div>
      </div>
      <div class="main">
        <div class="lists" v-infinite-scroll="loadGoodsInfo" infinite-scroll-immediate="true" style="overflow:auto">
          <div class="item" v-for="(item,idx) in products" :class="'item'+idx"  @click="openDialog(item,idx)"  @mouseover="mouseoverFn">
            <div class="cover">
              <div class="thumb" :style="{backgroundImage:'url('+item.ImgPath+')'}"></div>
              <div class="mask"></div>
              <div class="tip">加入选品库</div>
            </div>
            <div class="title line10">{{item.Products_Name}}</div>
            <div class="price-box line10">
              <span class="danger-color"><span class="font12">￥</span>{{item.Products_PriceX}}</span>
              <span class="graytext2 font12 padding10-c">￥{{item.Products_PriceY}}</span>
            </div>
            <div class="sales">月销{{item.Products_Sales}}</div>
          </div>
        </div>

      </div>

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
        <div class="sub-btn" @click="subFn">提交进货单</div>
      </div>
      <div id="imgs"></div>
    </div>

<!--    -->

    <div @click="cartDialogCancel" class="cartsDialogMask"  @mousewheel.prevent  v-show="cartsDialogInstance.innerVisible"></div>
    <div class="cartsDialog" v-show="cartsDialogInstance.innerVisible"  v-loading="cartsDialogInstance.loading">
      <div class="carts-dialog-container" v-if="carts.lists.length>0" >
        <div class="goods-item" v-for="(goods,idx) of carts.lists" :key="idx"  >
          <div class="cover" :style="{backgroundImage: 'url('+goods.ImgPath+')'}"><i @click="cartRemoveFn(goods)" class="el-icon-error"></i></div>
          <div class="title">{{goods.ProductsName}}</div>
          <!--{{formatSpec(goods.spec_key,',')}}-->
          <div class="attr">{{goods.Productsattrstrval}}</div>
          <div class="numbox" >
           <span class="label">数量: </span>
            <input class="input" v-model="goods.num" />
            <div class="num-btns">
              <span @click="cartPlusFn(goods,goods.num)" class="num-btn plus-btn"><i class="el-icon-arrow-up"></i></span>
              <span @click="cartMinsFn(goods,goods.num)" class="num-btn minus-btn"><i class="el-icon-arrow-down"></i></span>
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

    <el-dialog
      :visible.sync="dialogInstance.innerVisible"
      title="选择商品属性"
      width="500px"
      center
      @close="dialogCancel"
      append-to-body
      class="innerDislog"
    >
      <!--            :class="dialogInstance.skuval[idx1]==spec?'skuCheck':'unablechoose'"-->
      <div class="dialog-container" v-loading="dialogInstance.loading" >
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
                <el-button @click="dialogSub" :loading="dialogInstance.addCartReq" style="background: #F43131;color:white" >确 定</el-button>
            </span>
    </el-dialog>
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
    import {fun} from '../common';
    import {getProductList,getProductDetail,updateCart,getCartList,delCart} from '../common/fetch';
    import {numberSort, findArrayIdx, objTranslate, compare_obj} from '@/common/utils';
    import {Fly} from '../common/UnitBezier';
    import {Cart} from '@/common/cart';
    import _ from 'underscore';
    import Cookies from 'js-cookie';

    const cartInstance = new Cart()

    const Stores_ID = Cookies.get('Stores_ID')
    const User_ID = Cookies.get('User_ID')

    @Component({
        computed:{
            noMore () {
                return this.paginate.finish
            },
            count_num(){
              return cartInstance.getLen()
            },
            disabled () {
                return this.loading || this.noMore
            }
        }
    })
    export default class StoreChannel extends Vue {

        fly_img_url = ''
        curPosX = 0
        curPosY = 0
        lastPosX = 0
        lastPosY = 0
        isMove = false
        carts = cartInstance
        products = []
        keyword = ''
        loading = false
        paginate = {
            page:1,
            finish:false,
            pageSize:20,
            totalCount:0
        }

        cartsDialogInstance = {
            innerVisible:false,
            loading:false
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


        cartCurrentItem = null

        cartPlusFn(goods,num){

            this.setCartCurrentItem(goods)
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
            this.cartCurrentItem = objTranslate(goods)
        }
        async cartNumChange(nVal,oVal){
            console.log(arguments)

            let select_store_id = 0
            let postData = {
                cart_key:'CartList',
                active:'store_pifa',
                prod_id:this.cartCurrentItem.Products_ID,
                qty:(nVal-oVal),
                active_id: `${Stores_ID}_${select_store_id}`
            }


            let add_card_rt = false


            this.cartsDialogInstance.loading = true
            await updateCart(postData).then(res=>{
                add_card_rt = true
                this.cartsDialogInstance.loading = false
                this.cartCurrentItem.num = nVal
            },err=>{
                this.cartsDialogInstance.loading = false
            })

            if(!add_card_rt)return;

        }

        async cartRemoveFn(goods){
            let postData = {cart_key:'CartList'}

            let prod_attr = {}
            if(goods.prd_attr_id){

                prod_attr[goods.Products_ID] = [goods.prd_attr_id]

            }else{
                prod_attr[goods.Products_ID] = []

            }
            postData.prod_attr = JSON.stringify(prod_attr)
            console.log(goods,postData)
            let del_rt =false
            this.cartsDialogInstance.loading = true
            await delCart(postData).then(res=>{
                del_rt = true
                this.cartsDialogInstance.loading = false
            },err=>{
                this.cartsDialogInstance.loading = false
            })
            if(!del_rt)return;
            cartInstance.remove(goods)
        }

        getClassFn(idx1,idx2){

            if(JSON.stringify(this.dialogInstance.product) == '{}')return {};

            let disabled = true;
            let count = 0;
            for(var key in this.dialogInstance.product.skuvaljosn){
                //看是不是已经选中的属性在数组二中存在,只要存在一个，就不会是禁用的
                //而且要有库存
                if(compare_obj(this.dialogInstance.skuval,this.dialogInstance.product.skuvaljosn[key].Attr_Value) && this.dialogInstance.product.skuvaljosn[key].Property_count>0){
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

        formatSpec(key_arr:any=[],separator:string=','){
            return key_arr.join(separator)
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

        async dialogSub(){

            if(this.dialogInstance.product.skujosn_new.length>0 && Object.keys(this.dialogInstance.skuval).length != Object.keys(this.dialogInstance.product.skujosn).length){
                fun.error({msg:'请选择所有规格'})
                return;
            }

            if(this.dialogInstance.product.skujosn_new.length>0 && !this.dialogInstance.prd_attr_id){
                fun.error({msg:'商品规格数据错误'})
                return;
            }



            let target = Object.assign({},this.dialogInstance.item,this.dialogInstance.product)
            target.skuval = this.dialogInstance.skuval
            target.speck_key = this.dialogInstance.skuval


            let select_store_id = 0
            let postData = {
                cart_key:'CartList',
                active:'store_pifa',
                prod_id:this.dialogInstance.product.Products_ID,
                qty:this.dialogInstance.num,
                active_id: `${Stores_ID}_${select_store_id}`
            }

            if(this.dialogInstance.product.skujosn_new.length>0 && this.dialogInstance.prd_attr_id){
                postData.attr_id = this.dialogInstance.prd_attr_id

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
            let add_card_rt = false

            this.dialogInstance.addCartReq = true
            await updateCart(postData).then(res=>{
                add_card_rt = true
                this.dialogInstance.addCartReq = false
            },err=>{
                this.dialogInstance.addCartReq = false
            })

            if(!add_card_rt)return;

            this.dialogInstance.loading = false
            this.dialogInstance.innerVisible = false

            this.addCart(target,this.dialogInstance.idx)

        }

        async openDialog(goods,idx){

            this.dialogInstance.innerVisible = true
            this.dialogInstance.item = goods
            this.dialogInstance.idx = idx

            let product = {}
            this.dialogInstance.loading = true
            await getProductDetail({prod_id:goods.Products_ID}).then(res=>{

                product = res.data;
                if(res.data.skujosn) {
                    let skujosn = res.data.skujosn;
                    let skujosn_new = [];
                    for (let i in res.data.skujosn) {
                        skujosn_new.push({
                            sku: i,
                            val: skujosn[i]
                        });
                    }

                    product.skujosn_new = skujosn_new;
                    product.skuvaljosn = res.data.skuvaljosn;
                }else{
                    product.skujosn_new = []
                    product.skuvaljosn = ''
                }


            }).catch(e=>{
                console.log(e)
            })

            //库存
            this.dialogInstance.stock = product.Products_Count
            this.dialogInstance.product = product
            this.dialogInstance.innerVisible = true

            this.dialogInstance.loading = false

        }

        subFn(){
            console.log(this.flys[0].move === this.flys[1].move)
        }

        addCart(goods,idx){

            if(this.isMove){
                fun.info({msg:'操作太快'})
                return;
            }
            //添加
            if(!cartInstance.add(goods))return;

            this.fly_img_url = goods.ImgPath
            this.isMove = true
            let _self = this

            let randId = Date.now()+goods.Products_ID
            let eleStr = `<img src="${goods.ImgPath}" class="fly-pic" id="${randId}" style="{left:${this.curPosX}px,top:${this.curPosY}px}" />`

            let imgs = document.getElementById('imgs')
            imgs.innerHTML += eleStr;

            let itemDom = document.querySelector('.item'+idx)
            var rect = itemDom.getBoundingClientRect()

            let opt = {
                start:{left:rect.left,top:rect.top,height:200,width:200},
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

        mouseoverFn(e) {
            // if(this.isMove)return;
            // // 获取当前位置x
            // this.curPosX = e.clientX
            // this.curPosY = e.clientY
            // console.log(this.curPosX,this.curPosY)
        }

        loadGoodsInfo(){

            if(this.paginate.finish)return;
            this.loading = true
            const loadingInstance = this.$loading()
            getProductList({Products_Name:this.keyword,...this.paginate}).then(res=>{
                this.loading = false

                this.paginate.totalCount = res.totalCount
                setTimeout(function () {
                    loadingInstance.close()
                },500)

                //长度为0停止了
                if(res.data.length===0){
                    this.paginate.finish = true
                    return;
                }

                this.paginate.page ++

                if(this.paginate.page===1){
                    this.products = res.data
                    window.scrollTo({left:0,top:0})
                }else{
                    this.products = this.products.concat(res.data)
                }

            })
        }

        searchFn(){
            this.paginate.finish = false
            this.paginate.page = 0
            this.loadGoodsInfo()
        }

        mounted(){
            this.$nextTick().then(()=>{

                document.body.className += 'el-popup-parent--hidden'

                let handle = document.querySelector('.foot')
                let preBoundingClientRect = handle.getBoundingClientRect()
                this.lastPosY = preBoundingClientRect.top
                this.lastPosX = document.body.offsetWidth/2
            })
        }

        syncCardList(){
            return getCartList({act:'get_cart',User_ID,cart_key:'CartList'}).then(res=>{
              return res.data.CartList
            })
        }

        created(){
            this.syncCardList().then((CartList)=>{
                console.log(CartList)
                for(var key in  CartList){
                    for(var idx in CartList[key]){
                        let goods = CartList[key][idx]
                        goods.num = goods.Qty
                        if(goods.Productsattrkeystrval && goods.Productsattrkeystrval.Product_Attr_ID)goods.prd_attr_id = goods.Productsattrkeystrval.Product_Attr_ID
                        goods.Products_ID = key
                        //模拟加入
                        this.carts.add(goods)
                    }
                }
            })
          //this.loadGoodsInfo()


        }

    }
</script>
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
        background-color: #e5e5e5;
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

  margin: 0 auto;
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
  .search-btn{
    height: 36px;
    width: 74px;
    color: white;
    background: #F43131;
    border: none;
    padding: 0;
    margin: 0;
  }
}

</style>


