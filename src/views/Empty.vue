<template>
  <div class="home-wrap">
    <div style="width: 1200px;margin: 100px auto;border:1px solid #e7e7e7;padding: 10px;">
<!--      act1="get_self_store_prod"-->
      <fun-table
        :columns="columns"
        act="get_prod"

      >
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


        columns = [
            {
                columnName: "Product_ID",
                label: "产品ID",
                // align: "center",
                // sortable: true,
                //后面这些是filter使用的
                search: false //不需要搜索ID,所以都不需要了
            },
            {
                columnName: "Product_Name",
                label: "商品名称",
                field: "Product_Name",
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
                columnName: "Product_Cate",
                label: "商品分类",
                field: "Product_Cate",
                value:'',
                hidden:true,
                // align: "center",
                // sortable: true,
                //后面这些是filter使用的
                search: {
                    type: 'select',
                    operate: 'like',
                    option:[] // { value: '1', label: '类别一'},
                }
            }
        ]

        cates = []



        created(){
            getProductCategory().then(res=>{
                let cates = res.data

                // arr2table(newArr,'Category_ID','Category_ParentID')
                this.cates = restArr(cates,'child')

                //修改
                let idx = findArrayIdx(this.columns,{name:'Product_Cate',label:'商品分类'})
                if(idx!==false){
                    this.columns[idx].search.option = this.cates.map(item=>{
                        return {label:item.new_name,value:item.Category_ID}
                    })
                }

            })
        }
    }
</script>
<style lang="less" scoped>


  /*赠品*/
  .cardTitle{
    display: flex;
    align-items: center;
  }
  .current{
    cursor: pointer;
    color: #79B0FF;
    margin-left: 10px;
  }
  .fixDisplay{
    display: flex;
    align-items: center;
  }
</style>

