<template>
  <div class="fun-table-plugin">
    <div class="section filter">
      <fun-search :size="formSize" :columns="columns" @submit="filterFn">
        <slot name="filter"></slot>
      </fun-search>

    </div>
    <div class="section table">
      <el-table :data="lists">
        <template v-for="(rows,idx1) in columns">
          <el-table-column
            v-if="!rows.hidden"
            :label="rows.label"

            :width="rows.width">
            <!--简单值的情况-->
            <template slot-scope="props" >

<img height="100px" :src="props.row.ImgPath" />

            </template>

<!--            <template-->
<!--              v-for="(slot,index) in $scopedSlots"-->
<!--              slot-scope="props"-->
<!--              :slot="index"-->
<!--            >-->
<!--              <slot :row="props.row" :col="props.col" :value="props.value" :name="index"/>-->
<!--            </template>-->

          </el-table-column>
        </template>
      </el-table>
    </div>

    <div class="section paginate">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[100, 200, 300, 400]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="400">
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

    const noop = ()=>{}
    const extendFn = (obj)=>{
        var o = {},
            attr = Array.prototype.slice.call(arguments).slice(1);

        attr.forEach(function(val, index) {
            if (val in obj) { o[val] = obj[val]; }
        });

        return o;

    }

    @Component({
        components:{
            FunSearch
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
            default:'small'
        })
        formSize
        @Prop({
            type:Array,
            required:true,
            // default:()=>{
            //     return [
            //         {
            //             width:180,
            //             label:'列名称',
            //             value:'值'
            //         },
            //         {
            //             width:180,
            //             label:'列名称',
            //             value:'值'
            //         }
            //     ]
            // }
        })
        columns //表头和内容显示的配置
        @Prop({
            type:[Array,Boolean],
            default:false
        })
        dataList //可能是已经有的数据，如果有该配置。那么就不需要加载数据了

        @Prop({
            type:Boolean,
            default:true
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

        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
        }

        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
        }

        filterFn(){

        }

        /**
         * 拼接筛选条件
         */
        buildFilterFormData(){

        }

        loadData(){
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
            if(this.dataList){
                this.lists = this.dataList
                return
            }

            this.loadData()
        }




    }
</script>

<style lang="less" scoped>

</style>
