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
<!--          -->
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
        <div class="count">
          已选取<span class="danger-color">{{count_num}}</span>/500个普通商品
        </div>
        <div class="sub-btn" @click="subFn">提交进货单</div>
      </div>
      <div id="imgs"></div>
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
      <div class="dialog-container" v-loading="dialogInstance.loading">
        <div class="row" v-for="(item,idx1) of dialogInstance.product.skujosn_new" :key="idx1" >
          <span class="label">{{item.sku}}:</span>
          <div class="specs">
            <div class="spec-item"   @click="selectAttr(item.sku,spec)"  v-for="(spec,idx2) of item.val" :key="index">
              {{spec}}
              <i class="el-icon-check"></i>
              <div class="fill"></div>
            </div>
          </div>
        </div>
        <div class="row">
          <span class="label">数量:</span>
          <div class="specs">
            <el-input-number size="mini" v-model="dialogInstance.num" :step="1"></el-input-number>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
                <el-button @click="dialogCancel">取 消</el-button>
                <el-button @click="dialogSub" style="background: #F43131;color:white" >确 定</el-button>
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
    import {getProductList,getProductDetail} from '../common/fetch';
    import {numberSort,findArrayIdx} from '@/common/utils';
    import {Fly} from '../common/UnitBezier';
    import {Cart} from '@/common/cart';

    const cartInstance = new Cart()

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
            pageSize:20
        }

        dialogInstance = {
            innerVisible:false,
            loading:false,
            num:0,
            check_attr:[],
            skuval:{},
            product:{},
            item:null,
            idx:0
        }

        //直接赋值了
        selectAttr(val1,val2){
            this.dialogInstance.skuval[val1] = val2
        }

        dialogCancel(){
            this.dialogInstance.loading = false
            this.dialogInstance.innerVisible = false
        }

        dialogSub(){
            this.dialogInstance.loading = false
            this.dialogInstance.innerVisible = false
            this.addCart(this.dialogInstance.item,this.dialogInstance.idx)
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
                let handle = document.querySelector('.foot')
                let preBoundingClientRect = handle.getBoundingClientRect()
                this.lastPosY = preBoundingClientRect.top
                this.lastPosX = document.body.offsetWidth/2
            })
        }

        created(){
          //this.loadGoodsInfo()
        }

    }
</script>
<style lang="less" scoped>
.page-wrap{
  position: relative;
  width:100%;
  overflow: hidden;
  background: #f8f8f8;
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
  z-index: 9;
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


