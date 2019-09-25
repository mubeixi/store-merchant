<template>
  <div class="selectPage">
    <el-dialog
      :visible.sync="show"
      title="选择商品"
      width="70%"
      append-to-body
      class="innerDislog"
    >
      <div class="container">
<!--        `Users_ID` varchar(10) NOT NULL,-->
<!--        `Coupon_ID` int(11) unsigned NOT NULL AUTO_INCREMENT,-->
<!--        `Coupon_Keywords` varchar(50) DEFAULT NULL,-->
<!--        `Coupon_Title` varchar(50) DEFAULT NULL,-->
<!--        `Coupon_Subject` varchar(50) DEFAULT NULL,-->
<!--        `Coupon_PhotoPath` varchar(100) DEFAULT NULL,-->
<!--        `Coupon_UsedTimes` tinyint(3) DEFAULT '-1',-->
<!--        `Coupon_UserLevel` tinyint(1) DEFAULT '0' COMMENT '设定领取优惠券所需要的最小会员等级,-1是不限定等级,其余需要指定的会员等级领取优惠券.但需要大于0',-->
<!--        `Coupon_StartTime` int(10) DEFAULT NULL,-->
<!--        `Coupon_EndTime` int(10) DEFAULT NULL,-->
<!--        `Coupon_Description` text,-->
<!--        `Coupon_CreateTime` int(10) DEFAULT NULL,-->
<!--        `Coupon_UseArea` tinyint(1) DEFAULT '0' COMMENT '使用范围  0 实体店  1 微商城',-->
<!--        `Coupon_UseType` tinyint(1) DEFAULT '0' COMMENT '优惠方式 0 折扣  1 抵现金',-->
<!--        `Coupon_Condition` int(10) DEFAULT '0' COMMENT '使用条件 如 满300才可使用',-->
<!--        `Coupon_Discount` decimal(10,2) DEFAULT '0.00' COMMENT '折扣',-->
<!--        `Coupon_Cash` int(10) DEFAULT '0' COMMENT '现金',-->
<!--        `Biz_ID` int(10) DEFAULT '0' COMMENT '微商圈商家',-->
        <el-table
          :data="list"
          v-loading="loading"
          stripe
          max-height="500"
          ref="multipleTable"
          @selection-change="handleSelectionChange"
          @row-click="handleRowChange"
          style="width: 100%">
          <el-table-column type="selection">
          </el-table-column>
          <el-table-column
            prop="Products_ID"
            fixed
            label="ID">
          </el-table-column>
          <el-table-column
            prop="Products_Name"
            fixed
            label="名称">
          </el-table-column>
          <el-table-column
            prop="Products_JSON"
            fixed
            width="160"
            label="缩略图">
            <template slot-scope="scope">
              <img style="height: 60px;max-width: 100px;" :src="scope.row.ImgPath" />
            </template>
          </el-table-column>
          <el-table-column
            prop="Products_PriceX"

            label="价格">
          </el-table-column>
        </el-table>
        <div class="pagination padding10-r">
          <el-pagination
            :hide-on-single-page="true"
            @prev-click="prev"
            @next-click="next"
            @current-change="current"
            background
            layout="prev, pager, next"
            :total="page_total">
          </el-pagination>
        </div>
      </div>

      <span slot="footer" class="dialog-footer">
                <el-button @click="cancel">取 消</el-button>
                <el-button type="primary" @click="selectCoupon">确 定</el-button>
            </span>
    </el-dialog>

  </div>
</template>

<script>
import {getProductList} from '../common/fetch';
import {domain} from '@/common/utils';

function noop() {

}
export default {
  name:'SelectGoodsComponent',
  props:{
    pageEl:{
      type:Object
    },
    onSuccess: {
      type: Function,
      default: noop,
    },
    ids:{
      type:String
    },
    show: {
      type: Boolean,
      default: false
    },
  },
  data(){
    return {
      loading: true,
      innerVisible:false,
      multipleSelection:[],
      list: [],
      //分页
      paginate:{
        page:1,
        total:0,
        pageSize:999
      }
    }
  },
  watch:{
    show: {
      immediate: true,
      handler(val){
        this.innerVisible = val
      }
    },
  },
  computed:{
    page_total(){
      return parseInt(this.total/this.pageSize)
    },
    //已经选择的ids_arr不要重复选择了
    ids_arr(){
      if(!this.ids) return [];
      return this.ids.join(',');
    }
  },

  created(){

    this.loadCouponInfo((arr)=>{
      this.list = arr;
    })

  },
  methods:{
    getPic(jsonstr){
      if(!jsonstr)return '';
      let obj = JSON.parse(jsonstr);
      if(!obj||!obj.ImgPath||obj.ImgPath.length<1)return '';

      return domain(obj.ImgPath[0])
    },
    //单击某一行
    handleRowChange(	row, column, event  ){
      this.$refs.multipleTable.toggleRowSelection(row)
    },
    filterTag(value, row) {
      return row.tag === value;
    },
    loadCouponInfo(call){
      //停止
      if(this.paginate.total>0 && this.page>=this.paginate.total)return;
      this.loading = true;
      let _self = this
      getProductList(this.paginate).then(res=>{
        setTimeout(function(){
          _self.loading = false;
        },600)
        this.paginate.total = res.totalCount;
        this.paginate.page++;
        call && call(res.data)
      })
    },
    next(){
      if(this.paginate.page == this.paginate.total)return;
      this.paginate.page++;
      this.loadCouponInfo((arr)=>{
        this.list = arr;
      })
    },
    current(num){
      if(this.paginate.page == num)return;
      this.paginate.page = num ;
      this.loadCouponInfo((arr)=>{
        this.list = arr;//this.list.concat(arr)
      })
    },
    prev(){
      if(this.paginate.page == 1)return;
      this.paginate.page--;
      this.loadCouponInfo((arr)=>{
        this.list = arr;
      })
    },
    selectCoupon({}){

      this.onSuccess.call(this,this.multipleSelection,this.pageEl)
      // this.innerVisible = false;
    },
    cancel(){
      this.$emit('couponCancel')
    },
    handleSelectionChange(val) {
      console.log(val)
      this.multipleSelection = val;

      // for(var item of val){
      //   if(this.multipleSelection.indexOf(item.Coupon_ID)===-1){
      //     this.multipleSelection.push(item.Coupon_ID);
      //   }
      // }

    }
  }
}
</script>
