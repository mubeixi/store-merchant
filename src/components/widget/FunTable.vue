<template>
  <div class="fun-table-plugin">
    <slot name="topToolBar"></slot>
    <div class="section filter">
      <fun-search :size="formSize" :columns="columns" @submit="filterFn">
        <slot name="filter"></slot>
      </fun-search>

    </div>
    <div class="section table">
      <el-table
        :height="height"
        :data="lists"
        ref="funTable"
        @row-click="handleRowChange"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <template v-for="(column,idx1) in computedColumns">
              <el-table-column
                :type="column.type"
                :key="column.prop + column.label"
                :label="column.label"
                :prop="column.prop"
                :width="column.width"
                :align="column.align"
              >
              <slot :name="getSlotNameFn(column)" :scope="scope" :row="scope.row" slot-scope="scope">
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
        var o = {},
            attr = Array.prototype.slice.call(arguments).slice(1);

        attr.forEach(function(val, index) {
            if (val in obj) { o[val] = obj[val]; }
        });

        return o;

    }

    import {RenderContent} from '@/components/widget/RenderContent';

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
                  if(val && _.isArray(val) && val.length>0){
                      this.lists = [...val]
                  }
              }
          },
          lists:{
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
            type:Number,
            default:10
        })
        pageSize
        @Prop({
            type:Number,
            default:10
        })
        totalCount
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
        is_paginate //是否分页
        @Prop({
            type:Object,
            default:() => {
                return {page:1,pageSize:20}
            }
        })
        paginateOpt //分页配置
        @Prop({
            type:String,
            require:true
        })
        act //请求的数据的方法

        @Prop({
            type:[Function,Boolean],
            default:false
        })
        __list_filter_func //拿到结果后数据过滤的


        lists = []
        currentPage = 1


        toggleSelection() {

            this.$refs.funTable.clearSelection();
            console.log('初始化选中的')
            if(!this.vkey || !this.has || !_.isArray(this.has) || this.has.length<1){
                this.$refs.funTable.clearSelection();
                return;
            };

            let rows = []

            for(var item of this.lists){
                if(this.has.indexOf(item[this.vkey]+'')!==-1){
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
                },100)

            }
        }

        getSlotNameFn (column) {
            if (typeof column.render === 'string') {
                return column.render
            }
           // console.log(`${column.prop}-column`)
            return `${column.prop}-column`
        }

        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
        }

        handleCurrentChange(val) {
            console.log(`当前页: ${val}`)
            this.$emit('currentChange', val); // 将当前对象传到父组件
        }

        filterFn(){

        }
        //单击某一行
        handleRowChange(row, column, event) {

            this.$refs.funTable.toggleRowSelection(row);
        }

        /**
         * 选中的值
         */
        handleSelectionChange(val){
            this.$emit('selectVal', val); // 将当前对象传到父组件
        }

        /**
         * 拼接筛选条件
         */
        buildFilterFormData(){

        }

        loadData(){

            if(this.dataList)return;
            let postData = {},
                filterData = this.buildFilterFormData()

            //pageSize等配置
            extendFn(postData,this.paginateOpt)

            //筛选条件
            extendFn(postData,filterData)
            if(!this.act){
                throw new Error('act参数必传')
                return
            }
            commonReq(this.act,postData).then(res=>{
                //看是否需要过滤
                if(this.__list_filter_func){
                    this.lists = this.__list_filter_func(res)
                }else{
                    this.lists = res.data
                }

            })

        }


        created(){
            // if(this.dataList){
            //     this.lists = [...this.dataList]
            //     return
            // }

            this.loadData()
        }




    }
</script>

<style lang="less" scoped>
.paginate-box{
  margin-top: 20px;
  margin-bottom: 10px;
}
</style>
