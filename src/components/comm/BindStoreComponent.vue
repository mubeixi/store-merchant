<template>
  <div class="selectPage">
    <el-dialog
      :visible.sync="innerVisible"
      :title="label"
      :top="top"
      width="70%"
      @close="cancel"
      :close-on-click-modal="maskClose"
      :close-on-press-escape="maskClose"
      append-to-body
      class="innerDislog"
    >
      <div class="filter flex">
        <el-select size="small" clearable v-model="province_idx"  placeholder="省份">
          <el-option
            v-for="(item,idx) in province_list"
            :key="idx"
            :label="item.name"
            :value="idx">
          </el-option>
        </el-select>
        <div class="space"></div>
        <el-select size="small" clearable v-model="city_idx"  placeholder="城市">
          <el-option
            v-for="(item,idx) in city_list"
            :key="idx"
            :label="item.name"
            :value="idx">
          </el-option>
        </el-select>
        <div class="space"></div>
        <el-select size="small" clearable v-model="area_idx"  placeholder="区/县">
          <el-option
            v-for="(item,idx) in area_list"
            :key="idx"
            :label="item.name"
            :value="idx">
          </el-option>
        </el-select>
        <div class="space"></div>
        <el-input class="w300" size="small" v-model="store_name" placeholder="门店名称" />
        <div class="space"></div>
        <el-input class="w180" size="small" v-model="store_no" placeholder="门店编码" />
        <div class="space"></div>
        <el-button @click="_init_data" size="small"  type="primary">搜索</el-button>

      </div>

      <div class="container">
        <el-table
          :data="list"
          v-loading="loading"
          max-height="500"
          ref="multipleTable"
          :highlight-current-row="single"
          @selection-change="handleSelectionChange"
          @row-click="handleRowChange"
          row-class-name="fun-table-row"
          style="width: 100%">
          <el-table-column type="selection" v-if="!single">
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
  import { City } from '../../common/city';
  import { emptyObject } from '../../common/utils';

  function noop() {
  }

  export default {
    name: 'BindStoreComponent',
    props: {
      //默认不允许点击关闭
      maskClose:{
        type:Boolean,
        default:false
      },
      get_top:{
        type:Number,
        default:0,
      },
      self_store_id:{
        type:Number|String,
      },
      top:{
        type:String,
      },
      label: {
        type: String,
        default: '选择门店'
      },
      single: {
        type: Boolean,
        default: false
      },
      //store_id_list,只包含id
      has: {
        type: Array,
        default: ()=>[]
      },
      pageEl: {
        type: Object,
        default:()=>{}
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
        store_name:'',
        store_no:'',
        province_idx:'',
        province: {},
        city: {},
        city_idx:'',
        area: {},
        area_idx:'',
        province_list: [],
        city_list: [],
        area_list: [],
        loading: true,
        finish: false,
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
      province_idx: {
        handler(val) {

          if (!val && val!==0) {
            this.province = {};
            this.city = {};
            this.city_idx = '';
            this.area = {};
            this.area_idx = '';

            this.city_list = []
            this.area_list = []
          }else{

            this.province = this.province_list[val]

            this.city = {};
            this.city_idx = '';
            this.area = {};
            this.area_idx = '';

            this.city_list = City.getCityList(this.province.id);

          }


        }
      },
      city_idx: {
        handler(val) {
          if (!val && val!==0) {
            this.city = {};
            this.area_idx = '';
            this.area = {};
            this.area_list = []

          }else{
            this.city = this.city_list[val]
            this.area_idx = '';
            this.area = {};
            this.area_list = City.getAreaList(this.province.id, this.city.id);
          }

        }
      },
      area_idx: {
        handler(val) {
          console.log('area修改了'+val)
          if (!val && val!==0) {
            this.area_idx = '';
            this.area = {};
          }else{
            this.area = this.area_list[val]
          }

        }
      },
      show: {
        immediate: true,
        handler(val) {
          this.innerVisible = val;

          if (val) {
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

      this.province_list = City.getProvinceList();

    },
    methods: {
      _init_data(){
        this.paginate =  {
          page: 1,
          total: 0,
          pageSize: 999
        }
        this.loadStoreInfo((arr) => {
          //this.finish = true;
          this.list = arr;
        });
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
      loadStoreInfo(call) {
        //停止
        if (this.paginate.total > 0 && this.page >= this.paginate.total) return;
        this.loading = true;
        let _self = this;
        //构造请求
        let postData = {
          ...this.paginate,
          stores_name:_self.store_name,
          search_stores_sn:_self.store_no,
          province:_self.province.id,
          city:_self.city.id,
          area:_self.area.id,
          get_top:this.get_top,
          self_store_id:this.self_store_id
        };

        console.log(postData)

        getStoreList(emptyObject(postData))
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
        this.$emit('success',this.multipleSelection)
        // this.onSuccess.call(this, this.multipleSelection, this.pageEl);
      },
      cancel() {
        this.$emit('cancel');
      },
      handleSelectionChange(val) {
        let data = null
        if(this.single){
          data = val.pop();
        }else{
          data = val
        }

        this.multipleSelection =data


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
  .filter {
    margin-bottom: 10px;

    .space {
      width: 10px;
    }
  }
</style>
