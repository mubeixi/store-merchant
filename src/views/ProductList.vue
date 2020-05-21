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
        <el-button  size="mini" class="" type="primary" @click="goProduct">发布商品</el-button>
        <el-button  size="mini" class="" type="primary" @click="batch(4)">批量设置佣金</el-button>
        <el-button  size="mini" class="" type="primary" @click="batch(3)">批量重生二维码</el-button>
        <el-button  size="mini" class="" type="primary" @click="batch(2)">批量上架</el-button>
        <el-button  size="mini" class="" type="primary" @click="batch(1)">批量下架</el-button>
      </div>
      <fun-table
        :columns="dataTableOpt.columns"
        :dataList="dataTableOpt.dataList"
        :act="dataTableOpt.act"
        :_totalCount="dataTableOpt.totalCount"
        :_pageSize="dataTableOpt.pageSize"
        :is_paginate="dataTableOpt.is_paginate"
        :formSize="'small'"
        :isRow="true"
        :proPage="dataTableOpt.page"
        @handleSizeChange="handleSizeChange"
        @currentChange="currentChange"
        @selectVal="selectVal"
        @submit="submit"
        @reset="reset"
      >
        <template slot="Products_Name-column" slot-scope="props" >
         <div style="display: flex;align-items: center;margin-left: 10px">
           <img width="90px" height="100px" :src="props.row.img_url">
           <span style="margin-left: 10px">{{props.row.Products_Name}}</span>
         </div>
        </template>
        <template slot="Products_Profit-column" slot-scope="props">
            <span class="spans" style="margin-right: 0px" @click="dissetting(props.row.Products_ID)">查看详情</span>
        </template>
        <template slot="Products_Qrcode-column" slot-scope="props">
          <el-image
            @click="changeImg(props.row.Products_Qrcode)"
            style="width: 70px; height: 70px"
            :src="props.row.Products_Qrcode"
            :preview-src-list="imgPro">
          </el-image>
<!--          <img height="70px" width="70px" :src="props.row.Products_Qrcode">-->
        </template>
        <template slot="attr-column"  slot-scope="props">
            <div v-for="(item,index) of props.row.oattrs" >
              <el-tag style="width:80px;margin:0 auto;margin-bottom: 5px;display: block;">{{item}}</el-tag>
            </div>
        </template>
        <template slot="Products_PriceX-column"  slot-scope="props">
          <span>¥ {{props.row.Products_PriceX}}</span>
        </template>

        <template slot="Products_Sales-column" slot-scope="props">
          <span>{{props.row.Products_Sales}}/{{props.row.Products_Count}}</span>
        </template>
        <template slot="operate-column" slot-scope="props">
          <span class="spans" @click="goEdit(props)">编辑</span>
          <span class="spans" @click="delProduct(props)">删除</span>
          <span class="spans" @click="bindStoreList(props)">绑定门店</span>
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


        <bind-store-component
          @cancel="bindStoreCancel"
          @success="bindStoreSuccessCall"
          :pageEl="pageEl"
          :has="storeList"
          :isType="!boo"
          :show="bindStoreShow"
        />

    <el-dialog
      :visible.sync="dialogInstance.proSkuShow"
      title="选择商品属性"
      width="500px"
      center
      :close-on-click-modal="boo"
      @close="dialogCancels"
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
            <!--            :max="dialogInstance.stock"去掉库存限制-->
            <el-input-number controls-position="right" :min="1"  size="small" v-model="dialogInstance.num" :step="1"></el-input-number>
            <span class="font12 graytext2 padding10-c">库存{{dialogInstance.stock||'-'}}件</span>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
                <el-button @click="dialogCancel">取 消</el-button>
                <el-button @click="dialogSub" :loading="dialogInstance.addCartReq" style="background: #F43131;color:white" >确 定</el-button>
            </span>
    </el-dialog>

<!--    <el-dialog-->
<!--      :visible.sync="centerDialogVisible"-->
<!--      modal-->
<!--      close-on-click-modal-->
<!--      custom-class="dialog"-->
<!--    >-->
<!--      <el-carousel :autoplay="false" arrow="always">-->
<!--        <el-carousel-item v-for="item in data" :key="item">-->
<!--          <img :src="item">-->
<!--        </el-carousel-item>-->
<!--    </el-carousel>-->
<!--    </el-dialog>-->
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
    import {Loading} from "element-ui";
    import {getProducts,batchSetting,getProductCategory,delProduct,lookDissetting,getShippingTemplate,giveStoreProd} from '@/common/fetch';
    import {findArrayIdx, plainArray, createTmplArray, objTranslate,compare_obj} from '@/common/utils';
    import _ from 'underscore'
    import {float} from "html2canvas/dist/types/css/property-descriptors/float";
    import BindStoreComponent from "@/components/comm/BindStoreComponent.vue";
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


    // import Cookies from 'js-cookie';
    // const Stores_ID = Cookies.get('Stores_ID')
    // const User_ID = Cookies.get('Stores_Bind_User_ID')

    @Component({
        mixins:[],
        components: {
          BindStoreComponent
        }
    })

    export default class ProductList extends Vue {

        //绑定门店
      boo=false
        bindStoreShow=false
        storeList=[]
        pageEl=this
        selectStoreValue=[]
        proRow={} //点击商品的时候的信息
      dialogInstance={
        proSkuShow:false,
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
      dialogCancel(){
          this.dialogInstance.proSkuShow=false
          this.bindStoreShow=true
      }
      dialogCancels(){
        this.dialogInstance.proSkuShow=false
      }
      async dialogSub(){

        if(this.dialogInstance.stock<(this.dialogInstance.num*this.selectStoreValue.length)){
          this.$notify.error({
            title: '库存不足',
            message: '库存小于当前库存'
          });
          return
        }
        let cart_buy={}
        let proSku={
          [this.dialogInstance.product.Products_ID]:{
            [this.dialogInstance.prd_attr_id]:this.dialogInstance.num
          }
        }
        for(let item of  this.selectStoreValue){
          cart_buy[item]=proSku
        }

        let data={
          cart_buy:JSON.stringify(cart_buy),
          store_id:''
        }

        giveStoreProd(data).then(res=>{
          this.$notify({
            title: '成功',
            message: res.msg,
            type: 'success'
          })
          this.storeList=[]
          this.selectStoreValue=[]
          this.bindStoreShow=false
          this.dialogInstance.proSkuShow=false
        }).catch(e=>{
          this.$notify.error({
            title: '错误',
            message: e.msg
          })
        })



      }

          //点击绑定门店
        bindStoreList(props){
          this.bindStoreShow=true
          this.proRow=props.row
          this.dialogInstance.product=this.proRow
          let skujosn = this.dialogInstance.product.skujosn;
          let skujosn_new = [];
          for (let i in  this.dialogInstance.product.skujosn) {
            skujosn_new.push({
              sku: i,
              val: skujosn[i]
            });
          }

          this.dialogInstance.product.skujosn_new = skujosn_new;
          console.log(props,"sss")
        }
      bindStoreCancel(){
        this.bindStoreShow = false
      }
      bindStoreSuccessCall(list){
          this.selectStoreValue=[]
          for(let item of list){
            this.selectStoreValue.push(item.Stores_ID)
          }
          this.storeList=this.selectStoreValue
          this.bindStoreShow = false
          this.dialogInstance.proSkuShow=true
      }
      getClassFn(idx1,idx2){
        if(JSON.stringify(this.dialogInstance.product) == '{}')return {};
        let disabled = true;
        let count = 0;
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

        //绑定门店主要逻辑



        imgPro=[]
        changeImg(url){
            this.imgPro=[]
            this.imgPro.push(url)
        }
        activeName='1'
        dataTableOpt = {
            act : 'get_self_store_prod',
            dataList:[],
            page:4,
            totalCount:100,
            pageSize:10,
            is_paginate:true,//是否显示分页 默认显示
            columns : [
                {
                    prop: "Products_ID",
                    label: "产品ID",
                    align:'center',
                    width:138,
                    // align: "center",
                    // sortable: true,
                    //后面这些是filter使用的
                    search: false //不需要搜索ID,所以都不需要了
                },
                {
                    prop: "Products_Name",
                    label: "商品名称",
                    value:'',
                    width:300,
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
                    prop: "Products_Profit",
                    label: "分销佣金",
                    width:120,
                    align:'center',
                    search: false,
                    // render:function(h,optScope){
                    //     console.log(h,optScope)
                    // }
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
                    width:150,
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
        dissetting(id){
            this.settingShow=true
            lookDissetting({id:id}).then(res=>{
                if(res.errorCode==0){
                    this.settingData=res.data
                }
            })
        }
        goProduct(){
            this.$router.push({
                name: 'product'
            })
        }
        //批量操作type 1:批量下架 2：批量上架 3：批量生成二维码 4：批量设置佣金
        batch(type){
            let data={
                type:type,
                ids:JSON.stringify(this.selectValue)
            }
            if(type==4){
                this.$confirm('此操作将会按照默认佣金设置对您选择的商品佣金进行重置，您确定吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    batchSetting(data).then(res=>{
                        if(res.errorCode==0){
                            this.$message({
                                message: res.msg,
                                type: 'success'
                            });
                            this.getProduct()
                        }
                    })

                }).catch(() => {

                });
            }else{
                batchSetting(data).then(res=>{
                    if(res.errorCode==0){
                        this.$message({
                            message: res.msg,
                            type: 'success'
                        });
                        this.getProduct()
                    }
                })
            }

        }
        //删除
        delProduct(props){
           let id= props.row.Products_ID
            this.$confirm('你确定要删除这个商品吗', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                delProduct({id:id}).then(res=>{
                    if(res.errorCode==0){
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getProduct();
                    }
                })

            }).catch(() => {

            });
        }
        //跳转编辑页面
        goEdit(props){
            this.$store.dispatch('setProPage',this.dataTableOpt.page)
            this.$router.push({
                name: 'product',
                query: {
                    prod_id:props.row.Products_ID
                }
            })
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
                pageSize: this.dataTableOpt.pageSize,
                page:this.dataTableOpt.page,
                pro_name:this.dataTableOpt.columns[nameIdx].value,
                sel_oattr:this.dataTableOpt.columns[oattrIdx].value,
                sel_cate:this.dataTableOpt.columns[cateIdx].value,
                shipping_id:this.dataTableOpt.columns[oattrIdxs].value,
                status:this.activeName,
                store_id:''
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
                if(res.errorCode==0){
                    this.dataTableOpt.dataList=res.data
                    this.dataTableOpt.totalCount=res.totalCount
                    this.dataTableOpt.columns[oattrIdx].search.option=res.oattrs
                }
            })
        }

        created(){

            this.dataTableOpt.page=this.$store.state.page
            let pro_name = this.$route.query.pro_name
            let activeNames = this.$route.query.status

            let nameIdx = findArrayIdx(this.dataTableOpt.columns,{prop:'Products_Name'})
            let oattrIdx = findArrayIdx(this.dataTableOpt.columns,{prop:'attr'})
            if(pro_name){
                this.dataTableOpt.columns[nameIdx].value=pro_name
            }
            if(activeNames){
                this.activeName=activeNames
            }

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
<style lang="less" scoped>
  .spans{
    color:#428CF7;
    margin-right:4px;
    cursor:pointer;
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
          padding: 0 4px;
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


</style>
