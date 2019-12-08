<template>
  <div class="selectPage">
    <el-dialog
      :visible.sync="innerVisible"
      title="选择优惠券"
      width="70%"
      append-to-body
      @close="cancel"
      class="innerDislog"
    >
      <div class="container">
        <fun-table
          ref="funTableComp"
          :height="500"
          vkey="Coupon_ID"
          :has="ids_arr"
          :dataList.sync="list"
          :columns="columns"
          @selectVal="selectVal"
        >
          <template slot="Coupon_UserLevel-column" slot-scope="props">
            {{props.row.Coupon_UserLevel==-1?'不限定':props.row.Coupon_UserLevel}}
          </template>
          <template slot="Coupon_Discount-column" slot-scope="props">
            {{props.row.Coupon_UseType != 0?'-':props.row.Coupon_Discount}}
          </template>
          <template slot="Coupon_Cash-column" slot-scope="props">
            {{props.row.Coupon_UseType == 0?'-':'￥'+props.row.Coupon_Cash}}
          </template>
          <template slot="Coupon_UseType-column" slot-scope="props">
            {{props.row.Coupon_UseType == 0?'折扣':'抵现金'}}
          </template>
          <template slot="Coupon_UseArea-column" slot-scope="props">
            {{props.row.Coupon_UseArea==0 ? '实体店':'微商城'}}
          </template>
        </fun-table>

      </div>

      <span slot="footer" class="dialog-footer">
                <el-button @click="cancel">取 消</el-button>
                <el-button type="primary" @click="selectCoupon">确 定</el-button>
            </span>
    </el-dialog>

  </div>
</template>

<script>
  import { getCouponList } from '../common/fetch';

  export default {
    name: 'SelectCouponComponent',
    props: {
      ids: {
        type: String
      },
      show: {
        type: Boolean,
        default: false
      },
    },
    data() {
      return {
        columns:[
          {
            label:'ID',
            prop:'Coupon_ID',
            showIf:()=>false,
            search:false
          },
          {
            label:'名称',
            prop:'Coupon_Title',
            search:false,
            width:160
          },
          {
            label:'使用条件',
            prop:'Coupon_Condition',
            align:'center',
            search:false
          },
          {
            label:'优惠方式',
            prop:'Coupon_UseType',
            search:false
          },
          {
            label:'减免现金',
            prop:'Coupon_Cash',
            search:false
          },
          {
            label:'优惠折扣',
            prop:'Coupon_Discount',
            search:false
          },
          {
            label:'限定等级',
            prop:'Coupon_UserLevel',
            search:false
          },
          {
            label:'适用范围',
            prop:'Coupon_UseArea',
            search:false
          },
          {
            label:'介绍',
            prop:'Coupon_Description',
            search:false
          }
        ],
        loading: true,
        innerVisible: false,
        multipleSelection: [],
        list: [],
        finish: false,
        //分页
        paginate: {
          page: 1,
          total: 0,
          pageSize: 999
        }
      };
    },
    watch: {
      show: {
        immediate: true,
        handler(val) {
          this.innerVisible = val;

          if(val){
            // this.$nextTick().then(res=>{
            //   this.toggleSelection()
            // })
          }

          if (val && !this.finish) {

            this.loadCouponInfo((arr) => {
              this.finish = true;
              this.list = arr;
            });

          }
        }
      },
    },
    computed: {
      page_total() {
        return parseInt(this.total / this.pageSize);
      },
      //已经选择的ids_arr不要重复选择了
      ids_arr() {
        if (!this.ids) return [];
        return this.ids.split(',');
      }
    },

    created() {


    },
    methods: {
      //获取选中数据
      selectVal(val){
        console.log('选中数据',val)
        this.multipleSelection = val
      },
      // toggleSelection(rows) {
      //   if (rows) {
      //     rows.forEach(row => {
      //       this.$refs.multipleTable.toggleRowSelection(row);
      //     });
      //   } else {
      //     this.$refs.multipleTable.clearSelection();
      //   }
      // },
      //单击某一行
      handleRowChange(row, column, event) {
        this.$refs.multipleTable.toggleRowSelection(row);
      },
      filterTag(value, row) {
        return row.tag === value;
      },
      loadCouponInfo(call) {
        //停止
        if (this.paginate.total > 0 && this.page >= this.paginate.total) return;
        this.loading = true;
        let _self = this;
        getCouponList({...this.paginate,User_ID:null,store_id:null})
          .then(res => {
            setTimeout(function () {
              _self.loading = false;
            }, 600);
            this.paginate.total = res.totalCount;
            this.paginate.page++;
            call && call(res.data);
          });
      },
      next() {
        if (this.paginate.page == this.paginate.total) return;
        this.paginate.page++;
        this.loadCouponInfo((arr) => {
          this.list = arr;
        });
      },
      current(num) {
        if (this.paginate.page == num) return;
        this.paginate.page = num;
        this.loadCouponInfo((arr) => {
          this.list = arr;//this.list.concat(arr)
        });
      },
      prev() {
        if (this.paginate.page == 1) return;
        this.paginate.page--;
        this.loadCouponInfo((arr) => {
          this.list = arr;
        });
      },
      selectCoupon({}) {
        this.$emit('coupon', this.multipleSelection);
        // this.innerVisible = false;
      },
      cancel() {
        this.$emit('couponCancel');
      },
      handleSelectionChange(val) {
        console.log(val);
        this.multipleSelection = val;

        // for(var item of val){
        //   if(this.multipleSelection.indexOf(item.Coupon_ID)===-1){
        //     this.multipleSelection.push(item.Coupon_ID);
        //   }
        // }

      }
    }
  };
</script>

<style lang="less" scoped>

</style>
