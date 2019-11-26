<template>
  <div class="home-wrap">
    <div class="container">

      <div class="lists" v-infinite-scroll="loadInfo" infinite-scroll-immediate="true" style="overflow:auto">
        <div class="item" v-for="(apply,idx1) in applys" :key="idx1" >
          <div class="head flex">
            <div class="info flex flex1">
              <div class="store-pic" :style="{backgroundImage:'url('+apply.supplier_img+')'}"></div>
              <div class="store-title">{{apply.supplier_name}}</div>
              <div class="action" >(<span @click="showStore(apply.store)" class="action-item">查看信息</span><span  class="padding4-c">/</span><span class="action-item" @click="changeChannel(apply)" >修改渠道</span>)</div>
              <div class="order_no">进货单号: {{apply.Order_ID}}</div>
            </div>
            <div class="status">
              <span class="status-text danger-color padding10-c font14">{{apply.Order_Status_desc}}</span>
              <el-tooltip v-if="apply.reason" class="" effect="dark" :content="apply.reason" placement="top">
                <i class="el-icon-warning-outline danger-color padding10-c"></i>
              </el-tooltip>
              <i @click="delApply(apply,idx1)" v-if="inArray(apply.Order_Status,[21,23,25])"  title="删除订单" class="el-icon-delete-solid"></i>
            </div>
          </div>
          <table class="purchases"
                 v-loading="ajax_idx===idx1"
                 v-if="apply && apply.prod_list"
                 cellspacing="0">
            <tr class="goods-list" v-for="(item,idx2) in apply.prod_list" :key="idx2">
              <td class="goods">
                <div class="l" :style="{backgroundImage:'url('+item.prod_img+')'}"></div>
                <div class="c">
                  <div class="title line10">{{item.prod_name}}</div>
                  <div class="spec-key graytext font14">{{item.attr_info.attr_name}}</div>
                  <div  class="numbox graytext">
                    <span class="handle" v-if="inArray(apply.Order_Status,[23,25])">
                      <span class="minus" @click="minusFn(apply,item,idx1)">
                        <i class="el-icon-minus icon"></i>
                      </span>
                      <input class="input" :value="item.prod_count" @blur="setValFn($event,apply,item,idx1)" />
                      <span class="plus" @click="plusFn(apply,item,idx1)">
                        <i class="el-icon-plus icon"></i>
                      </span>
                    </span>
                    <span v-else>数量：{{item.prod_count}}</span>
                    <el-tooltip v-if="item.prod_count_change_desc" class="" effect="dark" :content="item.prod_count_change_desc" placement="top">
                      <i class="el-icon-warning-outline danger-color padding10-c font18"></i>
                    </el-tooltip>

                  </div>
                </div>
                <div class="r font14">金额:<span class="danger-color">￥<span class="price-num font16">{{item.prod_price}}</span></span></div>
              </td>
              <td class="price-box" v-if="idx2===0" :rowspan="apply.prod_list.length">
                <div class="text-center">
                  <div class="total line6">总计:<span class="danger-color">￥<span class="total_num font18">{{apply.Order_TotalPrice}}</span></span></div>
                  <div class="postage font14 graytext">(含运费￥{{apply.Order_Shipping.Price}})</div>
                </div>
              </td>
              <td class="actions text-center" v-if="idx2===0" :rowspan="apply.prod_list.length">
                <div v-if="inArray(apply.Order_Status,[21])"><el-button @click="cancelApply(apply,idx1)" class="acion-btn" type="danger">撤回进货单</el-button></div>
                <div v-if="inArray(apply.Order_Status,[22])">
                  <el-button class="acion-btn line8" type="danger">确认收货</el-button>
                  <div @click="showLogistics(apply)" class="font12 graytext2 logistics" >查看物流</div>
                </div>
                <div v-if="inArray(apply.Order_Status,[23,25])">
                  <el-button  @click="submitAplly(apply,idx1)" class="acion-btn" type="danger">提交进货单</el-button>
                </div>
              </td>
            </tr>
          </table>
        </div>
      </div>
    </div>
    <logistics-info ref="logistics" />
    <el-dialog
      :visible.sync="channelDialogInstance.innerVisible"
      title="切换渠道"
      width="848px"
      center
      @close="channelDialogCancel"
      append-to-body
      class="channel-container-wrap"
    >
      <div class="container-wrap">
        <el-form label-width="100px" class="form">
          <el-form-item label="进货渠道:" prop="channel">
            <el-select  v-model="channelDialogInstance.channel" placeholder="请选择类型" style="width: 100%" >
              <template v-for="(item,idx) of channelDialogInstance.channels">
                <el-option :label="item.name" :value="item.val" ></el-option>
              </template>
            </el-select>
          </el-form-item>
          <el-form-item label=" " prop="store_no" v-show="channelDialogInstance.channel!='shop'">
            <el-input  v-model="channelDialogInstance.store_no" placeholder="请输入门店编码" ></el-input>
          </el-form-item>
        </el-form>
        <div class="btn" @click="changeApplyChannel">确定</div>
      </div>

    </el-dialog>
    <el-dialog
      :visible.sync="storeDialogInstance.innerVisible"
      title="店铺信息"
      width="460px"
      center
      @close="storeDialogCancel"
      append-to-body
      class="innerDislog"
    >
      <div class="dialog-container"  >
        <div class="row">
          <div class="label">门店名称:</div>
          <div class="text">{{storeDialogInstance.info.Stores_Name}}</div>
        </div>
        <div class="row">
          <div class="label">门店电话:</div>
          <div class="text">{{storeDialogInstance.info.Stores_Telephone}}</div>
        </div>
        <div class="row">
          <div class="label">门店地址:</div>
          <div class="text">{{storeDialogInstance.info.Stores_Province_name}}{{storeDialogInstance.info.Stores_City_name}}{{storeDialogInstance.info.Stores_Area_name}}{{storeDialogInstance.info.Stores_Address}}</div>
        </div>
      </div>

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
    import {getStorePurchaseApply,getStoreList,changeStoreApplyChannel,updateStoreApplyGoodsNum,cancalStorePurchaseApply,subStorePurchaseApply,delStorePurchaseApply} from '../common/fetch';
    import {objTranslate,findArrayIdx} from '@/common/utils';
    import {fun} from '@/common';
    import LogisticsInfo from '@/components/comm/LogisticsInfo'


    @Component({
        mixins:[],
        components: {
            LogisticsInfo
        }
    })


    export default class StorePurchaseApply extends Vue {

        applys = []
        stores = []

        channelDialogInstance = {
            apply:null,
            store_no:null,
            channel:null,
            channels:[{id:1,name:'门店进货',val:'store'}, {id:2,name:'平台进货',val:'shop'}],
            innerVisible:false
        }

        storeDialogInstance = {
            info:{},
            innerVisible:false
        }

        paginate = {
            page:1,
            finish:false,
            pageSize:20,
            totalCount:0
        }


        ajax_idx = null

        async delApply(apply,idx){

            let _self = this
            this.$confirm('删除订单不可恢复, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                _self.ajax_idx = idx
                delStorePurchaseApply({order_id:apply.Order_ID}).then(res=>{
                    _self.applys.splice(idx,1)
                    setTimeout(function () {
                        _self.ajax_idx = null
                    },100)
                })
            }).catch(() => {

            });


        }

        async submitAplly(apply,idx){

            this.ajax_idx = idx
            await subStorePurchaseApply({order_id:apply.Order_ID}).then(res=>{
                apply.Order_Status =  21
                apply.Order_Status_desc =  "待处理"
            })
            let _self = this
            setTimeout(function () {
                _self.ajax_idx = null
            },100)
        }

        async cancelApply(apply,idx){
            this.ajax_idx = idx
            await cancalStorePurchaseApply({order_id:apply.Order_ID}).then(res=>{
                apply.Order_Status =  25
                apply.Order_Status_desc =  "已撤回"
            })
            //延时是为了触发加载的
            let _self = this
            setTimeout(function () {
                _self.ajax_idx = null
            },100)
        }

        showLogistics(apply){

            let {out_order_no='',Express=''} = {...apply.Order_Shipping,out_order_no:apply.Order_ShippingID}

            if(!out_order_no || !Express)return;
            let logisticsComponent = this.$refs.logistics
            logisticsComponent.setExpress(Express)
            logisticsComponent.setOutOrderNo(out_order_no)
            logisticsComponent.show()
            logisticsComponent.search()
        }

        setValFn(e,apply,goods,idx){
            let Attr_ID = null
            if(goods.attr_info && goods.attr_info.attr_val){
                Attr_ID  = goods.attr_info.attr_val.Product_Attr_ID
            }
            let newVal = e.target.value,oldVal = goods.prod_count
            console.log(e.target.value)
            //如果设置失败，数量要变回来
            this.updateGoodsStock(apply.Order_ID,goods.prod_id,Attr_ID,e.target.value,function(){
                goods.prod_count = newVal
            },function(){
                console.log('errorerror')
                e.target.value = oldVal
            },idx)
        }

        plusFn(apply,goods,idx){

            let Attr_ID = null
            if(goods.attr_info && goods.attr_info.attr_val){
                Attr_ID  = goods.attr_info.attr_val.Product_Attr_ID
            }
            this.updateGoodsStock(apply.Order_ID,goods.prod_id,Attr_ID,goods.prod_count+1,function(){goods.prod_count++},null,idx)
        }

        minusFn(apply,goods,idx){
            let Attr_ID = null
            if(goods.attr_info && goods.attr_info.attr_val){
                Attr_ID  = goods.attr_info.attr_val.Product_Attr_ID
            }
            this.updateGoodsStock(apply.Order_ID,goods.prod_id,Attr_ID,goods.prod_count-1,function(){goods.prod_count--},null,idx)
        }

        async updateGoodsStock(order_id,prod_id,attr_id,modify_prod_count,call,errcall,idx){

            this.ajax_idx = idx
            await updateStoreApplyGoodsNum({order_id,prod_id,attr_id,modify_prod_count}).then(res=>{
                console.log('success')
                call && call()
            },err=>{
                console.log('error')
                errcall && errcall()
            })

            let _self = this
            setTimeout(function () {
                _self.ajax_idx = null
            },100)

        }

        inArray(val,arr){
            return arr.indexOf(val)!=-1
        }
        changeApplyChannel(){

            if(!this.channelDialogInstance.channel){
                fun.info({msg:'渠道必选'});
                return;
            }
            if(this.channelDialogInstance.channel==='store' && !this.channelDialogInstance.store_no){
                fun.info({msg:'门店编码必填'});
                return;
            }

            let postData = {purchase_type:this.channelDialogInstance.channel,order_id:this.channelDialogInstance.apply.Order_ID}

            if(this.channelDialogInstance.channel==='store'){
                postData.purchase_store_sn = this.channelDialogInstance.store_no
            }

            changeStoreApplyChannel(postData).then(res=>{
                this.channelDialogCancel()
            })
        }

        changeChannel(apply){
            this.channelDialogInstance.apply = apply
            this.channelDialogInstance.innerVisible = true
        }

        channelDialogCancel(){
            this.channelDialogInstance.innerVisible = false
            this.channelDialogInstance.store_no = null
            this.channelDialogInstance.channel = null
            this.channelDialogInstance.apply = null
        }

        storeDialogCancel(){
            this.storeDialogInstance.innerVisible = false
            this.storeDialogInstance.info = {}
        }
        showStore(store){
            let idx = findArrayIdx(this.stores,{Stores_ID:store.Stores_ID})
            if(idx!==false){
                this.storeDialogInstance.info = this.stores[idx]
                this.storeDialogInstance.innerVisible = true
            }else{
                fun.error({msg:'店铺信息错误'})
            }

        }

        async loadInfo(){
            if(this.ajax_idx!==null)return
            const loadInstacne = this.$loading()
            await getStorePurchaseApply({...this.paginate}).then(res=>{

                this.paginate.totalCount = res.totalCount

                //长度为0停止了
                if(res.data.length===0){
                    this.paginate.finish = true
                    return;
                }

                var tempStore = {
                    headimg:'https://ss1.baidu.com/6ONXsjip0QIZ8tyhnq/it/u=1373026939,1825269194&fm=173&app=25&f=JPEG?w=500&h=402&s=118B99550496CBDE52072DEF0300E01A',
                    title:'店铺名称',
                    Stores_ID:10
                }
                let rt = res.data.map(item=>{


                    for(var goods of item.prod_list){
                        if(goods.attr_info){
                            goods.attr_info = JSON.parse(goods.attr_info)
                        }
                    }

                    return {...item,store:tempStore}
                })
                console.log(objTranslate(rt))

                if(this.paginate.page===1){
                    this.applys = rt
                    window.scrollTo({left:0,top:0})
                }else{
                    this.applys = this.applys.concat(rt)
                }

                this.paginate.page ++

            },err=>{

            })
            loadInstacne.close()
        }

        async created(){

            getStoreList({pageSize:999}).then(res=>{
                this.stores = res.data
            })
        }



    }
</script>
<style lang="stylus">
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
</style>
<style lang="less" scoped>
.dialog-container{
  .row{
    display: flex;
    margin-bottom: 10px;
    .label{
      color: #999;
      width: 72px;
    }
    .text{
      color: #444;
    }
  }
}
.container{
  width: 1200px;
  margin: 87px auto;
  .lists{
    .item{
      border: 1px solid #EDEDED;
      margin-bottom: 30px;
      .head{
        height: 65px;
        background: #f7f7f7;
        align-items: center;
        padding: 0 15px;
        .info{
          align-items: center;
          font-size: 14px;
          .store-pic{
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background-size: cover;
            background-repeat: no-repeat;
            background-position: center;
            margin-right: 15px;
          }
          .store-title{
            margin-right: 15px;
            color: #333;
          }
          .action{
            color: #F43131;
            .action-item{
              text-decoration: underline;
              cursor: pointer;
            }
          }
          .order_no{
            margin-left: 30px;
            color: #666;
          }
        }
        .status{
          .el-icon-delete-solid{
            cursor: pointer;
            color: #999;
            &:hover{
              color: #F43131;
            }
          }
        }
      }
      .purchases{
        border-collapse:collapse;
        width: 100%;
        .goods-list{

          &:last-child{
            .goods{
              border-bottom: none;
            }

          }
          .goods{
            display: flex;
            align-items: center;
            padding: 15px;
            border-bottom: 1px solid #EDEDED;

            .l{
              width: 100px;
              height: 100px;
              background-size: cover;
              background-repeat: no-repeat;
              background-color: #f2f2f2;
              background-position: center;
            }
            .c{
              flex:1;
              padding: 0 15px;
              .numbox{
                margin-top: 25px;
                display: flex;
                align-items: center;
                .handle{
                  background: #f2f2f2;
                  height: 34px;
                  display: flex;
                  align-items: center;
                  width: 104px;
                  .input{
                    width: 40px;
                    height: 24px;
                    line-height: 24px;
                    outline: none;
                    padding: 0 4px;
                    box-sizing: border-box;
                    text-align: center;
                  }
                  .plus,.minus{
                    text-align: center;
                    display: block;
                    line-height: 34px;
                    width: 34px;
                    height: 34px;
                    cursor: pointer;
                    .icon{

                    }
                  }
                  .minus{

                  }
                  .plus{

                  }
                }
              }
            }
            .r{
              width: 120px;
              text-align: right;
            }
          }
        }
        .price-box{
          width: 226px;
          border-left: 1px solid #EDEDED;
          border-right: 1px solid #EDEDED;
          /*flex-grow: 1*/
          /*height: 100%;*/
        }
        .actions{
          width: 184px;
          .logistics{
            cursor: pointer;
          }
        }

      }

    }
  }
}
</style>

