<template>
  <div class="selectPage">
    <el-dialog
      :visible.sync="innerVisible"
      title="选择商品"
      width="70%"
      @close="cancel"
      append-to-body
      class="innerDislog"
    >
      <div class="container">
        <fun-table
          ref="funTableComp"
          :height="500"
          vkey="Products_ID"
          :has="ids_arr"
          :dataList.sync="list"
          :columns="columns"
          @selectVal="selectVal"

          @submit="submit"
          @reset="reset"
        >
          <template slot="Products_Name-column" slot-scope="props">
            <div style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">{{props.row.Products_Name}}</div>
          </template>
          <template slot="img_url-column" slot-scope="props">
            <img height="40px" :src="props.row.img_url" />
          </template>
          <template slot="Products_PriceX-column" slot-scope="props">
            <span class="" style="color: #F43131"><span class="font14">￥</span>{{props.row.Products_PriceX}}</span>
          </template>
        </fun-table>
      </div>


      <span slot="footer" class="dialog-footer">
                <el-button @click="cancel">取 消</el-button>
                <el-button type="primary" @click="selectFn">确 定</el-button>
            </span>
    </el-dialog>

  </div>
</template>

<script>
  import { getProductList,getFlashSaleList,getProducts } from '../common/fetch';
  import {findArrayIdx} from '../common/utils';
  import { domain } from '@/common/utils';


  function noop() {

  }

  export default {
    name: 'SelectGoodsComponent',
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
      ids: {
        type: String,
        default:''
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
            prop:'Products_ID',
            width:100,
            search:false
          },
          {
            label:'名称',
            prop:'Products_Name',
              name:'name_area',
              search: {
                  type: 'input',
                  operate: 'like',
              }
          },
          {
            label:'缩略图',
            prop:'img_url',
            width:140,
            align:'center',
            search:false
          },
          {
            label:'价格',
            prop:'Products_PriceX',
            width:100,
            sortable:true,
            name:'price_area',
            search:{
                type:'between',
                operate:'BETWEEN',
                value:[null,null]
            }
          }, {
                prop: "attr",
                label: "特殊属性",
                align:'center',
                name:'attr_area',
                width:150,
                value:'',
                showIf:(row)=>false,
                search: {
                    option:'',
                    type: 'select',
                    operate: 'like',
                }
            },
        ],
        loading: true,
        finish:false,
        innerVisible: false,
        multipleSelection: [],
        list: [],
        //搜索
          search:null,
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
            this.paginate.page = 1;
          }



          if (val && !this.finish) {

            this.loadGoodsInfo((arr) => {
              //this.finish = true;
                arr.filter(column =>
                    column.Products_PriceX = parseFloat(column.Products_PriceX)
                )
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
        return this.ids.split(',');
      }
    },

    created() {


    },
    methods: {
        submit(params){
            this.search = {...params}
            this.paginate.page=1
            this.loadGoodsInfo((arr) => {
                //this.finish = true;
                arr.filter(column =>
                    column.Products_PriceX = parseFloat(column.Products_PriceX)
                )
                this.list = arr;
            })
        },
        reset(){
            for(let it in this.columns){
                if(this.columns[it].search){
                    if(this.columns[it].search.type=='between'){
                        this.columns[it].search.value=[null,null]
                        this.columns[it].value=[null,null]
                    }else{
                        this.columns[it].search.value=''
                        this.columns[it].value=''
                    }
                }

            }
            this.submit()
        },
      //获取选中数据
      selectVal(val){
        console.log('选中数据',val)
        this.multipleSelection = val
      },
      //当前页数
      currentChange(val){
        console.log(val)
      },
      getPic(jsonstr) {
        if (!jsonstr) return '';
        let obj = JSON.parse(jsonstr);
        if (!obj || !obj.ImgPath || obj.ImgPath.length < 1) return '';

        return domain(obj.ImgPath[0]);
      },
      //单击某一行
      // handleRowChange(row, column, event) {
      //   this.$refs.multipleTable.toggleRowSelection(row);
      // },
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
        postData.status=1
          postData.store_id=''
        //搜索
        if(this.search&&this.search.filter){
            console.log(this.search,"sss")
            if(this.search.filter.name_area){
                postData.pro_name=this.search.filter.name_area
            }
            if(this.search.filter.price_area){
                let arr=this.search.filter.price_area.split(',')
                console.log(arr,"sss")
                arr[0]?postData.min_price=arr[0]:''
                arr[1]?postData.max_price=arr[1]:''
            }
            if(this.search.filter.attr_area){
                postData.sel_oattr=this.search.filter.attr_area
            }


        }



        let getProductListFn = getProducts;
        //秒杀
        if(this.kill_flag){
          getProductListFn = getFlashSaleList;
          //postData.flashsale_flag = this.flashsale_flag;
        }

        //拼团
        if(this.pintuan_flag){
          getProductListFn = getProductList;//拼团需要
          postData.pintuan_flag = this.pintuan_flag;
        }
        getProductListFn(postData)
          .then(res => {
            setTimeout(function () {
              _self.loading = false;
            }, 600);
            this.paginate.total = res.totalCount;
            this.paginate.page++;
              let oattrIdx = findArrayIdx(this.columns,{prop:'attr'})
              this.columns[oattrIdx].search.option=res.oattrs
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
      selectFn({}) {

        this.onSuccess.call(this, this.multipleSelection, this.pageEl);
        // this.innerVisible = false;
      },
      cancel() {
        this.list = []
        this.$emit('cancel');
      },
      // handleSelectionChange(val) {
      //   console.log(val);
      //   this.multipleSelection = val;
      //
      //   // for(var item of val){
      //   //   if(this.multipleSelection.indexOf(item.Coupon_ID)===-1){
      //   //     this.multipleSelection.push(item.Coupon_ID);
      //   //   }
      //   // }
      //
      // }
    }
  };
</script>
<style lang="less" scoped>

</style>
