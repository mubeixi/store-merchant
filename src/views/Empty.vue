<template>
  <div class="home-wrap">
    <div style="width: 1200px;margin: 100px auto;border:1px solid #e7e7e7;padding: 10px;">
<!--      get_self_store_prod-->
      <div class="padding10">
        <el-button  size="mini" class="" type="primary" >发布商品</el-button>
        <el-button  size="mini" class="" type="primary" >批量设置佣金</el-button>
        <el-button  size="mini" class="" type="primary" >批量重生二维码</el-button>
        <el-button  size="mini" class="" type="primary" >批量上架</el-button>
        <el-button  size="mini" class="" type="primary" >批量下架</el-button>
        <el-button  size="mini" class="" type="primary" >退货</el-button>
      </div>
      <fun-table
        :columns="dataTableOpt.columns"
        :dataList="dataTableOpt.dataList"
        :act="dataTableOpt.act"
        @selectVal="selectVal"
      >
        <template slot="Products_Qrcode-column" slot-scope="props">
          <img height="60px" :src="props.row.Products_Qrcode" />
        </template>
        <template slot="attr-column"  slot-scope="props">
          <span class="padding4-c" v-if="props.row.Products_IsNew">
            <el-tag type="success">新品</el-tag>
          </span>
          <span class="padding4-c" v-if="props.row.Products_IsHot">
            <el-tag type="warning"> 热门</el-tag>
          </span>
        </template>
        <template slot="ImgPath-column" slot-scope="props">
          <img height="60px" :src="props.row.ImgPath" />
        </template>
        <template slot="operate-column" slot-scope="props">
          <span @click="handleOperate(props)">编辑</span>
          <span @click="handleOperate(props)">删除</span>
          <span @click="handleOperate(props)">退货</span>
        </template>
      </fun-table>
    </div>
  </div>
</template>
<script lang="ts">
    import {
        Component,
        Vue
    } from 'vue-property-decorator'
    import {
        Action,
        State
    } from 'vuex-class'
    import FunTable from '@/components/widget/FunTable'
    import {getProductList,getProductCategory} from '@/common/fetch';
    import {findArrayIdx, plainArray, createTmplArray, objTranslate} from '@/common/utils';
    import _ from 'underscore'
    const getParentsCount = (arr,key,pkey,val,tempArr)=>{
        var idx = false
        for(var i in arr){
            let item = arr[i]
            if(item[key] == val[pkey]){
                idx = i
                break;
            }
        }
        if(idx!==false){
            tempArr.push(1)
            //循环
            getParentsCount(arr,key,pkey,arr[idx],tempArr)
        }
    }
    const restArr = (arr,key)=>{
        let plainArr = []
        plainArray(arr,key,plainArr)
        for(var i in plainArr){
            let item = plainArr[i]
            item.parent_count = 0;
            let tempArr = []
            if(item['Category_ParentID']){
                getParentsCount(plainArr,'Category_ID','Category_ParentID',item,tempArr)
                item.parent_count = objTranslate(tempArr).length
            }
            item.new_name = createTmplArray('　├　',item.parent_count).join('')+item.Category_Name
        }
        return plainArr
    }

    @Component({
        mixins:[],
        components: {
            FunTable
        }
    })

    export default class Empty extends Vue {

        ids = []

        dataTableOpt = {
            act : 'get_self_store_prod',
            dataList:false,
            columns : [
                {
                    prop: "Products_ID",
                    label: "产品ID",
                    width:90,
                    align:'center',
                    // align: "center",
                    // sortable: true,
                    //后面这些是filter使用的
                    search: false //不需要搜索ID,所以都不需要了
                },
                {
                    prop: "Products_Name",
                    label: "商品名称",
                    field: "Products_Name",
                    // align: "center",
                    // sortable: true,
                    //后面这些是filter使用的
                    required: true,
                    search: {
                        type: 'input',
                        operate: 'like',
                    }
                },
                {
                    prop: "Products_Profit",
                    label: "分销佣金",
                    search: false,
                    // render:function(h,optScope){
                    //     console.log(h,optScope)
                    // }
                },
                {
                    prop: "Products_PriceX",
                    label: "商品价格",
                    search: false
                },
                {
                    prop: "Products_Qrcode",
                    label: "二维码",
                    // showIf:(row)=>false,
                    search: false
                },
                {
                    prop: "attr",
                    label: "特殊属性",
                    search: false
                },
                {
                    prop: "ImgPath",
                    label: "发布时间",
                    search: {
                        type: 'date',
                        min:'',
                        max:''
                    }
                },
                {
                    prop: "ImgPath",
                    label: "销量库存",
                    search: false
                },
                {
                    prop: "operate",
                    label: "操作",
                    search: false
                },
                // {
                //     prop: "",
                //     label: "商品分类",
                //     field: "Product_Cate",
                //     value:'',
                //     showIf: () => false,
                //     // align: "center",
                //     // sortable: true,
                //     //后面这些是filter使用的
                //     search: {
                //         type: 'select',
                //         operate: 'like',
                //         option:[] // { value: '1', label: '类别一'},
                //     }
                // },
                // {
                //     label: '操作',
                //     prop: 'operate',
                //     search: false
                // }
            ]
        }

        cates = []

        handleOperate(props){
            console.log(props.row)
        }

        //获取选中数据
        selectVal(val){
            console.log(val)
        }

        created(){
            // getProductCategory().then(res=>{
            //     let cates = res.data
            //     // arr2table(newArr,'Category_ID','Category_ParentID')
            //     this.cates = restArr(cates,'child')
            //     //修改
            //     let idx = findArrayIdx(this.columns,{name:'Product_Cate',label:'商品分类'})
            //     if(idx!==false){
            //         this.columns[idx].search.option = this.cates.map(item=>{
            //             return {label:item.new_name,value:item.Category_ID}
            //         })
            //     }
            // })
        }
    }
</script>
<style lang="stylus" scoped>
</style>
