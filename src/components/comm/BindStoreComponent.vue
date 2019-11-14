<template>
  <div class="selectPage">
    <el-dialog
      :visible.sync="innerVisible"
      title="关联门店"
      width="70%"
      @close="cancel"
      append-to-body
      class="innerDislog"
    >
      <div class="filter flex">

          <el-select v-model="province" size="small" placeholder="省份">
            <el-option
              v-for="item in province_list"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
          <div class="padding10-c"></div>
          <el-select v-model="city" size="small" placeholder="城市">
            <el-option
              v-for="item in city_list"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        <div class="padding10-c"></div>
          <el-select v-model="area" size="small" placeholder="区/县">
            <el-option
              v-for="item in area_list"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        <div class="padding10-c"></div>
        <el-button size="small" type="primary">搜索</el-button>



      </div>
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
            width="60"
            prop="Stores_ID"
            label="序号">
          </el-table-column>
          <el-table-column
            prop="Stores_Name"
            label="门店名称">
          </el-table-column>
          <el-table-column
            prop="Stores_Province_name"
            label="省份">
          </el-table-column>
          <el-table-column
            prop="Stores_City_name"
            label="城市">
          </el-table-column>
          <el-table-column
            prop="Stores_Area_name"
            label="区/县">
          </el-table-column>
          <el-table-column
            prop="Stores_Address"

            label="地址">
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
  import { getStoreList } from '../../common/fetch';
  import { domain } from '@/common/utils';
  import {City} from '../../common/city';


  function noop() {}

  export default {
    name: 'BindStoreComponent',
    props: {
      pageEl: {
        type: Object
      },
      onSuccess: {
        type: Function,
        default: noop,
      },
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
        province:'',
        city:'',
        area:'',
        province_list:[],
        city_list:[],
        area_list:[],
        loading: true,
        finish:false,
        innerVisible: false,
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
      province:{
        handler(val){
          this.city_list = City.getCityList(val)
        }
      },
      city:{
        handler(val){
          this.area_list = City.getAreaList(this.province,val)
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
            this.loadStoreInfo((arr) => {
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
      ids_arr() {
        if (!this.ids) return [];
        return this.ids.join(',');
      }
    },

    created() {

      this.province_list = City.getProvinceList()

    },
    methods: {
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
      loadStoreInfo(call) {
        //停止
        if (this.paginate.total > 0 && this.page >= this.paginate.total) return;
        this.loading = true;
        let _self = this;
        //构造请求
        let postData = JSON.parse(JSON.stringify(this.paginate));

        getStoreList(postData)
          .then(res => {
            setTimeout(function () {
              _self.loading = false;
            }, 300);
            this.paginate.total = res.totalCount;
            this.paginate.page++;
            call && call(res.data);
          });
      },
      next() {
        if (this.paginate.page == this.paginate.total) return;
        this.paginate.page++;
        // this.loadCouponInfo((arr) => {
        //   this.list = arr;
        // });
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
        this.onSuccess.call(this, this.multipleSelection, this.pageEl);
      },
      cancel() {
        this.$emit('cancel');
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
.filter{
  /*margin-bottom: 10px;*/
}
</style>
