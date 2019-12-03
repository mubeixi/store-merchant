<template>
  <div class="selectPage">
    <el-dialog
      :visible.sync="innerVisible"
      title="绑定限时抢购活动"
      width="70%"
      @close="cancel"
      append-to-body
      class="innerDislog"
    >
      <div class="container">

        <el-table
          :data="list"
          v-loading="loading"

          max-height="500"
          highlight-current-row
          ref="multipleTable"
          @current-change="handleCurrentChange"

          row-class-name="fun-table-row"
          style="width: 100%">

          <el-table-column
            prop="id"
            fixed
            width="60"
            label="ID">
          </el-table-column>
          <el-table-column
            prop="name"
            fixed
            width="300"
            label="名称">
          </el-table-column>
          <el-table-column
            prop="name"
            fixed
            label="名称">
          </el-table-column>
          <el-table-column
            prop="name"
            fixed
            label="名称">
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
  import { getSpikeList } from '../common/fetch';
  import { domain } from '@/common/utils';

  function noop() {

  }

  export default {
    name: 'SelectSpikeListComponent',
    props: {
      pageEl: {
        type: Object
      },
      pintuan_flag:{
        default:0
      },
      flashsale_flag:{
        default:0
      },
      kill_flag:{
        default:0
      },
      onSuccess: {
        type: Function,
        default: noop,
      },
      spike_id: {
        type: String | Number
      },
      show: {
        type: Boolean,
        default: false
      },
    },
    data() {
      return {
        loading: true,
        finish:false,
        innerVisible: false,
        currentRow:{},
        multipleSelection: [],
        list: [],
        //分页
        paginate: {
          page: 1,
          total: 0,
          pageSize: 999
        }
      };
    },
    watch: {
      list:{
        immediate:true,
        deep:true,
        handler(val){
          console.log('数据变化')
          if(val.length>0){
            this.toggleSelection()
          }
        }
      },
      show: {
        immediate: true,
        handler(val) {
          this.innerVisible = val;

          if(val){
            this.paginate.page = 1;
          }



          if (val && !this.finish) {

            this.loadGoodsInfo((arr) => {
              //this.finish = true;
              this.list = arr;
            });

          }

        }
      },
    },
    computed: {
      page_total() {
        return parseInt(this.paginate.total / this.paginate.pageSize);
      },
      //已经选择的ids_arr不要重复选择了
      // ids_arr() {
      //   if (!this.ids) return [];
      //   return this.ids.join(',');
      // }
    },

    created() {


    },
    methods: {
      toggleSelection() {
        console.log('初始化')
        if(!this.spike_id)return;
        this.$refs.multipleTable.clearSelection();

        let rows = []

        for(var item of this.list){
          if(item.id == this.spike_id){
            rows.push(item)
          }
        }
        console.log('设置为选中',rows)

        let _self = this
        if (rows) {
          setTimeout(function () {
            rows.forEach(row => {
              _self.$refs.multipleTable.setCurrentRow(row);
            });
          },100)

        }
      },
      getPic(jsonstr) {
        if (!jsonstr) return '';
        let obj = JSON.parse(jsonstr);
        if (!obj || !obj.ImgPath || obj.ImgPath.length < 1) return '';

        return domain(obj.ImgPath[0]);
      },
      //单击某一行
      handleRowChange(row, column, event) {
        this.$refs.multipleTable.toggleRowSelection(row);
      },
      filterTag(value, row) {
        return row.tag === value;
      },
      loadGoodsInfo(call) {
        //停止
        if (this.paginate.total > 0 && this.page >= this.paginate.total) return;
        this.loading = true;
        let _self = this;
        //构造请求
        let postData = JSON.parse(JSON.stringify(this.paginate));

        getSpikeList(postData)
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

        this.onSuccess.call(this, this.currentRow, this.pageEl);
        // this.innerVisible = false;
      },
      cancel() {
        this.$emit('cancel');
      },
      handleCurrentChange(val) {
        console.log(val);
        this.currentRow = val;

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
