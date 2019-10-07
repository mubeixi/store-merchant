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
        <el-table
          :data="list"
          v-loading="loading"
          stripe
          max-height="500"
          ref="multipleTable"
          @selection-change="handleSelectionChange"
          @row-click="handleRowChange"
          row-class-name="fun-table-row"
          style="width: 100%">
          <el-table-column type="selection">
          </el-table-column>
          <el-table-column
            prop="Coupon_ID"
            fixed
            label="ID">
          </el-table-column>
          <el-table-column
            prop="Coupon_Title"
            fixed
            label="名称">
          </el-table-column>
          <el-table-column
            prop="Coupon_Condition"
            label="使用条件">
            <template slot-scope="scope">
              ￥{{scope.row.Coupon_Condition}}
            </template>
          </el-table-column>
          <el-table-column
            prop="Coupon_UseType"
            label="优惠方式">
            <template slot-scope="scope">
              {{scope.row.Coupon_UseType == 0?'折扣':'抵现金'}}
            </template>
          </el-table-column>
          <el-table-column
            label="减免现金">
            <template slot-scope="scope">
              {{scope.row.Coupon_UseType==0?'—':'￥'+scope.row.Coupon_Cash}}
            </template>
          </el-table-column>
          <el-table-column
            prop=""
            label="优惠折扣">
            <template slot-scope="scope">
              {{scope.row.Coupon_UseType!=0?'—':scope.row.Coupon_Discount}}
            </template>
          </el-table-column>
          <el-table-column
            label="限领等级">
            <template slot-scope="scope">
              {{scope.row.Coupon_UserLevel==-1?'不限定':scope.row.Coupon_UserLevel}}
            </template>
          </el-table-column>
          <el-table-column
            label="使用范围">
            <template slot-scope="scope">
              {{scope.row.Coupon_UseArea==0 ? '实体店':'微商城'}}
            </template>
          </el-table-column>
          <el-table-column
            prop="Coupon_Description"
            width="180"
            label="介绍">
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
            this.$nextTick().then(res=>{
              this.toggleSelection()
            })
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
        return this.ids.join(',');
      }
    },

    created() {


    },
    methods: {
      toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        } else {
          this.$refs.multipleTable.clearSelection();
        }
      },
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
        getCouponList(this.paginate)
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
