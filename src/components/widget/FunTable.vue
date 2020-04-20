<template>
  <div class="fun-table-plugin">
    <slot name="topToolBar"></slot>
    <div class="section filter">
      <fun-search :size="formSize" :columns="columns" @submit="filterFn" @reset="reset">
        <slot name="filter"></slot>
      </fun-search>

    </div>
    <div class="section table">
<!--      <div class="padding15-r graytext2 text-center" v-if="lists.length<221">暂无数据</div>-->
      <el-table
        v-loading="getDataLoding"
        class="wzw-tableS"
        :height="height"
        :data="lists"
        border
        ref="funTable"
        @row-click="handleRowChange"
        @selection-change="handleSelectionChange">
        <el-table-column
          v-if="isSelect"
          type="selection"
          align="center"
          width="70">
        </el-table-column>
        <template v-for="(column,idx1) in computedColumns">
              <el-table-column
                :type="column.type"
                :key="column.prop + column.label"
                :label="column.label"
                :prop="column.prop"
                :width="column.width"
                :align="column.align"
                :sortable="column.sortable?true:false"
              >
              <slot :name="getSlotNameFn(column)" :scope="scope" :idx="scope.$index" :row="scope.row" slot-scope="scope">
                <render-content :option="{render: column.render,scope: scope,column: column}"></render-content>
              </slot>
              </el-table-column>
        </template>
      </el-table>
    </div>

    <div class="section paginate-box text-center" v-if="is_paginate">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 40,50]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount">
      </el-pagination>
      <div class="myButton" v-if="showSave">
        <el-button size="small" type="primary" @click="closeDialog">保存</el-button>
      </div>
    </div>
  </div>

</template>

<script lang="ts">
    import {
        Component,
        Vue,
        Prop
    } from 'vue-property-decorator';
    import {
        mapState
    } from 'vuex';
    import FunSearch from './FunSearch'
    import {commonReq} from '@/common/fetch';
    import MyRender from './MyRender'
    import _ from 'underscore'
    const noop = ()=>{}
    const extendFn = (obj)=>{
        var o = {},attr = Array.prototype.slice.call(arguments).slice(1);
        attr.forEach(function(val, index) {
            if (val in obj) { o[val] = obj[val]; }
        });
        return o;
    }
    import {RenderContent} from '@/components/widget/RenderContent';
    import col from "element-ui/packages/col/src/col";
    import {objTranslate} from "../../common/utils";
    const valInArr = (val,arr)=>{
        let rt = false
        for(var i in arr){
            if(arr[i]==val){
                rt = true;
                break;
            }
        }
        return rt;
    }

    @Component({
        components:{
            FunSearch,MyRender,RenderContent
        },
        computed:{
            computedColumns () {
                return this.columns.filter(column =>
                    column.showIf ? column.showIf(this.lists) : true
                )
            }
        },
        watch:{
          dataList:{
              immediate:true,
              deep:true,
              handler(val){
                  if(_.isArray(val)){
                      this.lists = [...val]
                  }
              }
          },
          lists:{
              immediate:true,
              deep:true,
              handler(val){
                  //有变动就需要渲染下
                  this.toggleSelection()
              }
          },
          has:{
              immediate:true,
              deep:true,
              handler(val){

              }
          },
          _totalCount:{
              handler(val){
                  this.totalCount = val
              }
          },

          _pageSize:{
              handler(val){
                  this.pageSize = val
              }
          },
          _page:{
              handler(val){
                  this.currentPage = val
              }
          }
        },
        filters:{

        }
    })

    export default class FunTable extends Vue {
        filterColVal(row,columName){
            return row[columName]
        }
        @Prop({
            type:String,
        })
        vkey //主键

        @Prop({
            type:Array,
            default:()=>[]
        })
        has //是否有已经选中的选项

        @Prop({
            type:Number
        })
        height

        @Prop({
            type:Boolean,
            default:false
        })
        is_paginate //是否分页
        @Prop({
            type:Number,
            default:1
        })
        _page //分页配置
        @Prop({
            type:Number,
            default:10
        })
        _pageSize
        @Prop({
            type:Number,
            default:0
        })
        _totalCount

        @Prop({
            type:String,
            default:'small'
        })
        formSize

        @Prop({
            type:Array,
            required:true,
        })
        columns //表头和内容显示的配置
        @Prop({
            type:[Array,Boolean],
            default:false
        })
        dataList //可能是已经有的数据，如果有该配置。那么就不需要加载数据了



        @Prop({
            type:Boolean,
            default:false
        })
        isRow //是否点击某行某行选中



        @Prop({
            type:[String,Boolean],
        })
        act //请求的数据的方法
        @Prop({
            type:[Function,Boolean],
            default:false
        })
        __list_filter_func //拿到结果后数据过滤的

        @Prop({
            type:Object,
            default:()=>{}
        })
        extParam

        @Prop({
            type:[Function,Boolean],
            default:(parama,extParam)=>{
                let newOBJ ={}
                Object.assign(newOBJ,parama,extParam)
                return newOBJ
            }
        })
        __params_filter_func //发起请求前参数混合的


        @Prop({
            type:Boolean,
            default:false
        })
        showSave //是否显示保存
        @Prop({
            type:Boolean,
            default:true
        })
        isSelect //是否多选

        //loading
        getDataLoding = false

        lists = []

        currentPage = 1 //当前页
        totalCount = 0 //分页数据
        pageSize = 10 //页面数据


        toggleSelection() {

            //this.$refs.funTable.clearSelection();
            console.log('初始化选中的',objTranslate(this.has))
            if(!this.vkey || !this.has || !_.isArray(this.has) || this.has.length<1){
                console.log('清空数据')
                this.$refs.funTable.clearSelection();
                return;
            };

            let rows = []

            console.log(objTranslate(this.lists))
            for(var item of this.lists){
                if(valInArr(item[this.vkey],this.has)){
                    rows.push(item)
                }
            }
            console.log('设置为选中',rows)

            let _self = this
            if (rows) {
                setTimeout(function () {
                    rows.forEach(row => {
                        _self.$refs.funTable.toggleRowSelection(row,true);
                    });
                },10)

            }
        }

        getSlotNameFn (column) {
            if (typeof column.render === 'string') {
                return column.render
            }
           // console.log(`${column.prop}-column`)
            return `${column.prop}-column`
        }

        closeDialog(){
            this.$emit('closeDialog')
        }

        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
            this.pageSize = val
            this.currentPage = 1
            this.$emit('handleSizeChange', val); // 将当前对象传到父组件
            if(this.act){
                this.loadData()
            }
        }

        handleCurrentChange(val) {
            console.log(`当前页: ${val}`)
            this.currentPage = val
            this.$emit('currentChange', val); // 将当前对象传到父组件
            if(this.act){
                this.loadData()
            }
        }

        filterFn(params){
            /**
             * 需要完善
             */
            this.$emit('submit',params);
        }
        reset(){
            this.$emit('reset');
        }
        //单击某一行
        handleRowChange(row, column, event) {
            if(this.isRow) return
            this.$refs.funTable.toggleRowSelection(row);
        }

        /**
         * 选中的值
         */
        handleSelectionChange(val){
            let tempA = val.map(item=>JSON.stringify(item))
            let tempB = this.lists.map(item=>JSON.stringify(item))

            var sa = new Set(tempA);
            var sb = new Set(tempB);

            //补集
            let complement  = [...tempA.filter(x => !sb.has(x)), ...tempB.filter(x => !sa.has(x))];
            let other = complement.map(item=>JSON.parse(item))
            this.$emit('selectVal', val,other); // 将当前对象传到父组件
        }

        /**
         * 拼接筛选条件
         */
        buildFilterFormData(){

        }

        async loadData({paramObj={}}={}){

            if(this.dataList)return;
            let postData = {},
                filterData = this.buildFilterFormData()

            //pageSize等配置
            if(this.is_paginate){
                Object.assign(postData,{page:this.currentPage,pageSize:this.pageSize})
            }


            //筛选条件
            Object.assign(postData,filterData)
            if(!this.act){
                throw new Error('act参数必传')
                return
            }

            this.getDataLoding = true


            Object.assign(postData,paramObj)

            //修改参数
            if(this.__params_filter_func){
                postData = this.__params_filter_func(postData,this.extParam)
            }
            await commonReq(this.act,postData).then(res=>{
                this.totalCount = res.totalCount

                //看是否需要过滤
                if(this.__list_filter_func){
                    this.lists = this.__list_filter_func(res)
                }else{
                   this.lists = res.data
                }

                // if(this.currentPage * this.pageSize<this.totalCount){
                //     this.currentPage++
                // }

            }).catch(e=>{})

            this.getDataLoding = false

        }



        created(){

            if(this.act){
                this.loadData()
            }

        }




    }
</script>

<style lang="less" scoped>
.paginate-box{
  margin-top: 20px;
  margin-bottom: 10px;
}

.wzw-tableS /deep/ th {
  color: #333 !important;
  background-color: #f8f8f8 !important;
}
  .myButton{
    position: fixed;
    bottom: 0px;
    width: 80%;
    margin-left: -20px;
    background-color: #fff;
    border-top: 1px solid #EEEEEE;
    height: 50px;
    line-height: 50px;
    z-index: 999;
  }
</style>
