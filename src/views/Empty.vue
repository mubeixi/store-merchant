<template>
  <div class="home-wrap">
    <div style="width: 1200px;margin: 100px auto;border:1px solid #e7e7e7;padding: 10px;">
<!--      get_self_store_prod-->

      <fun-table
        :columns="dataTableOpt.columns"
        :dataList="dataTableOpt.dataList"
        :act="dataTableOpt.act"
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
          <el-button plain size="mini" type="primary" icon="el-icon-edit" @click="handleOperate(props)"></el-button>
          <el-button plain size="mini" type="primary" icon="el-icon-edit" @click="handleOperate(props)"></el-button>
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

    const mockDataList  = [{"Products_ID":643,"Products_Type":91,"Products_Name":"Nike Air PRESTO 2.0 x OFF-WHITE 联名黑白休闲男跑步鞋 AA3830 AA3830-100 36","Products_JSON":{"ImgPath":["https://new401.bafangka.com/uploadfiles/wkbq6nc2kc/image/20191120101945150.jpg","https://new401.bafangka.com/uploadfiles/wkbq6nc2kc/image/20191120101945135.jpg","https://new401.bafangka.com/uploadfiles/wkbq6nc2kc/image/20191120101945146.jpg"]},"Products_PriceY":"9999.00","Products_PriceX":"6666.00","Products_SoldOut":0,"Products_Status":1,"Products_Count":71092,"Products_Sales":16367631,"Products_Weight":"12.50","Products_IsVirtual":0,"Products_IsRecieve":0,"Products_IsHot":1,"Products_IsNew":1,"Products_IsRecommend":1,"Products_IsShippingFree":0,"Products_IsPaysBalance":1,"click_count":61,"pintuan_flag":1,"pintuan_people":2,"pintuan_start_time":1574758429,"pintuan_end_time":1574870400,"pintuan_pricex":"22.00","Products_BriefDescription":"海红专卖店aj门店发货","ImgPath":"https://new401.bafangka.com/uploadfiles/wkbq6nc2kc/image/20191120101945150.jpg","is_pintuan":0,"skujosn":{"颜色":{"1":"黑色","2":"白色"},"尺寸":{"3":"41","4":"42"},"面料":{"5":"羊皮","6":"牛皮"}},"skuvaljosn":{"1;3;5":{"Product_Attr_ID":608,"Products_ID":643,"Attr_ID":76,"Attr_Value":{"颜色":"黑色","尺寸":"41","面料":"羊皮"},"Attr_Price":6676,"Supply_Price":"0.00","pt_pricex":"0.00","Property_count":8888,"number_id":"","Attr_Image":"https://new401.bafangka.com/uploadfiles/wkbq6nc2kc/image/20191120102901181.jpg"},"1;3;6":{"Product_Attr_ID":609,"Products_ID":643,"Attr_ID":76,"Attr_Value":{"颜色":"黑色","尺寸":"41","面料":"牛皮"},"Attr_Price":6676,"Supply_Price":"0.00","pt_pricex":"0.00","Property_count":8888,"number_id":"","Attr_Image":"https://new401.bafangka.com/uploadfiles/wkbq6nc2kc/image/20191120102901181.jpg"},"1;4;5":{"Product_Attr_ID":610,"Products_ID":643,"Attr_ID":76,"Attr_Value":{"颜色":"黑色","尺寸":"42","面料":"羊皮"},"Attr_Price":6686,"Supply_Price":"0.00","pt_pricex":"0.00","Property_count":8888,"number_id":"","Attr_Image":"https://new401.bafangka.com/uploadfiles/wkbq6nc2kc/image/20191120102901181.jpg"},"1;4;6":{"Product_Attr_ID":611,"Products_ID":643,"Attr_ID":76,"Attr_Value":{"颜色":"黑色","尺寸":"42","面料":"牛皮"},"Attr_Price":6686,"Supply_Price":"0.00","pt_pricex":"0.00","Property_count":8888,"number_id":"","Attr_Image":"https://new401.bafangka.com/uploadfiles/wkbq6nc2kc/image/20191120102901181.jpg"},"2;3;5":{"Product_Attr_ID":612,"Products_ID":643,"Attr_ID":76,"Attr_Value":{"颜色":"白色","尺寸":"41","面料":"羊皮"},"Attr_Price":6696,"Supply_Price":"0.00","pt_pricex":"0.00","Property_count":8888,"number_id":"","Attr_Image":"https://new401.bafangka.com/uploadfiles/wkbq6nc2kc/image/20191120102002106.jpg"},"2;3;6":{"Product_Attr_ID":613,"Products_ID":643,"Attr_ID":76,"Attr_Value":{"颜色":"白色","尺寸":"41","面料":"牛皮"},"Attr_Price":6696,"Supply_Price":"0.00","pt_pricex":"0.00","Property_count":8888,"number_id":"","Attr_Image":"https://new401.bafangka.com/uploadfiles/wkbq6nc2kc/image/20191120102002106.jpg"},"2;4;5":{"Product_Attr_ID":614,"Products_ID":643,"Attr_ID":76,"Attr_Value":{"颜色":"白色","尺寸":"42","面料":"羊皮"},"Attr_Price":6706,"Supply_Price":"0.00","pt_pricex":"0.00","Property_count":8888,"number_id":"","Attr_Image":"https://new401.bafangka.com/uploadfiles/wkbq6nc2kc/image/20191120102002106.jpg"},"2;4;6":{"Product_Attr_ID":615,"Products_ID":643,"Attr_ID":76,"Attr_Value":{"颜色":"白色","尺寸":"42","面料":"牛皮"},"Attr_Price":6706,"Supply_Price":"0.00","pt_pricex":"0.00","Property_count":8876,"number_id":"","Attr_Image":"https://new401.bafangka.com/uploadfiles/wkbq6nc2kc/image/20191120102002106.jpg"}}},{"Products_ID":754,"Products_Type":0,"Products_Name":"大话西游点卡50点","Products_JSON":{"ImgPath":["https://new401.bafangka.com/uploadfiles/wkbq6nc2kc/image/20191127105546183.png"]},"Products_PriceY":"10.00","Products_PriceX":"5.00","Products_SoldOut":0,"Products_Status":1,"Products_Count":98,"Products_Sales":402,"Products_Weight":"0.00","Products_IsVirtual":1,"Products_IsRecieve":0,"Products_IsHot":0,"Products_IsNew":1,"Products_IsRecommend":0,"Products_IsShippingFree":0,"Products_IsPaysBalance":1,"click_count":16,"pintuan_flag":0,"pintuan_people":0,"pintuan_start_time":0,"pintuan_end_time":0,"pintuan_pricex":"0.00","Products_BriefDescription":"大话西游点卡50点","ImgPath":"https://new401.bafangka.com/uploadfiles/wkbq6nc2kc/image/20191127105546183.png","is_pintuan":0},{"Products_ID":761,"Products_Type":91,"Products_Name":"一个限购的鞋子","Products_JSON":{"ImgPath":["https://new401.bafangka.com/uploadfiles/wkbq6nc2kc/image/20191127142814104.png"]},"Products_PriceY":"100.00","Products_PriceX":"80.00","Products_SoldOut":0,"Products_Status":1,"Products_Count":8,"Products_Sales":44000,"Products_Weight":"1.00","Products_IsVirtual":0,"Products_IsRecieve":0,"Products_IsHot":0,"Products_IsNew":0,"Products_IsRecommend":0,"Products_IsShippingFree":0,"Products_IsPaysBalance":1,"click_count":4,"pintuan_flag":0,"pintuan_people":0,"pintuan_start_time":0,"pintuan_end_time":0,"pintuan_pricex":"0.00","Products_BriefDescription":"一个限购的鞋子","ImgPath":"https://new401.bafangka.com/uploadfiles/wkbq6nc2kc/image/20191127142814104.png","is_pintuan":0,"skujosn":{"颜色":{"1":"黑色","2":"黄色"},"尺寸":{"3":"L"},"面料":{"4":"猪皮"}},"skuvaljosn":{"1;3;4":{"Product_Attr_ID":716,"Products_ID":761,"Attr_ID":76,"Attr_Value":{"颜色":"黑色","尺寸":"L","面料":"猪皮"},"Attr_Price":81,"Supply_Price":"3.00","pt_pricex":"0.00","Property_count":6,"number_id":"","Attr_Image":""},"2;3;4":{"Product_Attr_ID":717,"Products_ID":761,"Attr_ID":76,"Attr_Value":{"颜色":"黄色","尺寸":"L","面料":"猪皮"},"Attr_Price":81,"Supply_Price":"3.00","pt_pricex":"0.00","Property_count":2,"number_id":"","Attr_Image":"https://new401.bafangka.com/uploadfiles/wkbq6nc2kc/image/20191127144216188.jpg"}}},{"Products_ID":536,"Products_Type":0,"Products_Name":"全自动按摩加热洗脚足浴盆电动恒温家用深桶泡脚神器足疗机","Products_JSON":{"ImgPath":["https://new401.bafangka.com/uploadfiles/wkbq6nc2kc/image/5dca53b6f9.jpg","https://new401.bafangka.com/uploadfiles/wkbq6nc2kc/image/5dca53c52f.jpg","https://new401.bafangka.com/uploadfiles/wkbq6nc2kc/image/5dca53d179.jpg"]},"Products_PriceY":"699.00","Products_PriceX":"429.00","Products_SoldOut":0,"Products_Status":1,"Products_Count":9943,"Products_Sales":28049,"Products_Weight":"2.00","Products_IsVirtual":0,"Products_IsRecieve":0,"Products_IsHot":1,"Products_IsNew":0,"Products_IsRecommend":0,"Products_IsShippingFree":0,"Products_IsPaysBalance":1,"click_count":364,"pintuan_flag":1,"pintuan_people":3,"pintuan_start_time":1574652033,"pintuan_end_time":1605110400,"pintuan_pricex":"399.00","Products_BriefDescription":"","ImgPath":"https://new401.bafangka.com/uploadfiles/wkbq6nc2kc/image/5dca53b6f9.jpg","is_pintuan":1},{"Products_ID":245,"Products_Type":0,"Products_Name":"美的（Midea）M1-L213B 快捷微波炉 360°转盘加热 旋钮操控 精准控温 五档火力 21升","Products_JSON":{"ImgPath":["https://new401.bafangka.com/uploadfiles/wkbq6nc2kc/image/5dba8f57a6.jpg","https://new401.bafangka.com/uploadfiles/wkbq6nc2kc/image/5dba8f5c36.jpg","https://new401.bafangka.com/uploadfiles/wkbq6nc2kc/image/5dba8f617f.jpg"]},"Products_PriceY":"388.00","Products_PriceX":"309.00","Products_SoldOut":0,"Products_Status":1,"Products_Count":9997,"Products_Sales":9,"Products_Weight":"1.30","Products_IsVirtual":0,"Products_IsRecieve":0,"Products_IsHot":1,"Products_IsNew":1,"Products_IsRecommend":1,"Products_IsShippingFree":1,"Products_IsPaysBalance":1,"click_count":141,"pintuan_flag":1,"pintuan_people":22,"pintuan_start_time":1574418404,"pintuan_end_time":1604073600,"pintuan_pricex":"44.00","Products_BriefDescription":"【11月1日0:00-24：00超级秒杀日，提前开抢，价保11.11】当日秒杀价299！美的微波炉，加热快，超节能，营养美味皆可得！惊喜点击 ","ImgPath":"https://new401.bafangka.com/uploadfiles/wkbq6nc2kc/image/5dba8f57a6.jpg","is_pintuan":1},{"Products_ID":537,"Products_Type":0,"Products_Name":"MAC/魅可尤雾弹唇膏哑光口红 316/923丝绒雾面新款","Products_JSON":{"ImgPath":["https://new401.bafangka.com/uploadfiles/wkbq6nc2kc/image/5dca537a32.jpg","https://new401.bafangka.com/uploadfiles/wkbq6nc2kc/image/5dca56573f.jpg"]},"Products_PriceY":"699.00","Products_PriceX":"170.00","Products_SoldOut":0,"Products_Status":1,"Products_Count":9990,"Products_Sales":300013,"Products_Weight":"1.00","Products_IsVirtual":0,"Products_IsRecieve":0,"Products_IsHot":1,"Products_IsNew":1,"Products_IsRecommend":1,"Products_IsShippingFree":0,"Products_IsPaysBalance":1,"click_count":129,"pintuan_flag":0,"pintuan_people":0,"pintuan_start_time":1573541494,"pintuan_end_time":1605110400,"pintuan_pricex":"0.00","Products_BriefDescription":"哑而不干 柔雾质地 轻烟上唇","ImgPath":"https://new401.bafangka.com/uploadfiles/wkbq6nc2kc/image/5dca537a32.jpg","is_pintuan":0},{"Products_ID":544,"Products_Type":0,"Products_Name":"华迈空气净化器","Products_JSON":{"ImgPath":["https://new401.bafangka.com/uploadfiles/wkbq6nc2kc/image/5dca5806ef.jpg","https://new401.bafangka.com/uploadfiles/wkbq6nc2kc/image/5dca580b81.jpg","https://new401.bafangka.com/uploadfiles/wkbq6nc2kc/image/5dca581014.jpg","https://new401.bafangka.com/uploadfiles/wkbq6nc2kc/image/5dca5815e2.jpg","https://new401.bafangka.com/uploadfiles/wkbq6nc2kc/image/5dca58d020.jpg"]},"Products_PriceY":"1699.00","Products_PriceX":"999.00","Products_SoldOut":0,"Products_Status":1,"Products_Count":9995,"Products_Sales":704,"Products_Weight":"20.00","Products_IsVirtual":0,"Products_IsRecieve":0,"Products_IsHot":1,"Products_IsNew":1,"Products_IsRecommend":1,"Products_IsShippingFree":0,"Products_IsPaysBalance":1,"click_count":84,"pintuan_flag":0,"pintuan_people":0,"pintuan_start_time":1573542292,"pintuan_end_time":1605110400,"pintuan_pricex":"0.00","Products_BriefDescription":"","ImgPath":"https://new401.bafangka.com/uploadfiles/wkbq6nc2kc/image/5dca5806ef.jpg","is_pintuan":0},{"Products_ID":652,"Products_Type":92,"Products_Name":"李宁跑步鞋男鞋2019新款减震早晨跑男士时尚经典低帮运动鞋","Products_JSON":{"ImgPath":["https://new401.bafangka.com/uploadfiles/wkbq6nc2kc/image/20191120202324141.jpg","https://new401.bafangka.com/uploadfiles/wkbq6nc2kc/image/20191120202326156.jpg"]},"Products_PriceY":"2222.00","Products_PriceX":"222.00","Products_SoldOut":0,"Products_Status":1,"Products_Count":1997,"Products_Sales":1001,"Products_Weight":"2.00","Products_IsVirtual":0,"Products_IsRecieve":0,"Products_IsHot":1,"Products_IsNew":1,"Products_IsRecommend":1,"Products_IsShippingFree":0,"Products_IsPaysBalance":0,"click_count":66,"pintuan_flag":0,"pintuan_people":0,"pintuan_start_time":0,"pintuan_end_time":0,"pintuan_pricex":"0.00","Products_BriefDescription":"","ImgPath":"https://new401.bafangka.com/uploadfiles/wkbq6nc2kc/image/20191120202324141.jpg","is_pintuan":0,"skujosn":{"鞋码":{"1":"30","2":"31"},"颜色":{"3":"黄色"}},"skuvaljosn":{"1;3":{"Product_Attr_ID":616,"Products_ID":652,"Attr_ID":69,"Attr_Value":{"鞋码":"30","颜色":"黄色"},"Attr_Price":242,"Supply_Price":"220.00","pt_pricex":"0.00","Property_count":998,"number_id":"","Attr_Image":""},"2;3":{"Product_Attr_ID":617,"Products_ID":652,"Attr_ID":69,"Attr_Value":{"鞋码":"31","颜色":"黄色"},"Attr_Price":242,"Supply_Price":"220.00","pt_pricex":"0.00","Property_count":999,"number_id":"","Attr_Image":"https://new401.bafangka.com/uploadfiles/wkbq6nc2kc/image/20191120202346117.jpg"}}},{"Products_ID":543,"Products_Type":0,"Products_Name":"米蓓尔净透无瑕固态闪释 补水保湿面膜哈","Products_JSON":{"ImgPath":["https://new401.bafangka.com/uploadfiles/wkbq6nc2kc/image/5dca552777.jpg","https://new401.bafangka.com/uploadfiles/wkbq6nc2kc/image/5dca55441a.jpg","https://new401.bafangka.com/uploadfiles/wkbq6nc2kc/image/5dca55597f.jpg","https://new401.bafangka.com/uploadfiles/wkbq6nc2kc/image/5dca55631b.jpg","https://new401.bafangka.com/uploadfiles/wkbq6nc2kc/image/5dca559b56.jpg"]},"Products_PriceY":"298.00","Products_PriceX":"128.00","Products_SoldOut":0,"Products_Status":1,"Products_Count":10000,"Products_Sales":19928,"Products_Weight":"1.00","Products_IsVirtual":0,"Products_IsRecieve":0,"Products_IsHot":1,"Products_IsNew":1,"Products_IsRecommend":1,"Products_IsShippingFree":1,"Products_IsPaysBalance":1,"click_count":56,"pintuan_flag":0,"pintuan_people":0,"pintuan_start_time":1573541754,"pintuan_end_time":1605110400,"pintuan_pricex":"0.00","Products_BriefDescription":"","ImgPath":"https://new401.bafangka.com/uploadfiles/wkbq6nc2kc/image/5dca552777.jpg","is_pintuan":0},{"Products_ID":541,"Products_Type":0,"Products_Name":"越南玉芒大青芒新鲜水果包邮当季整箱甜心芒应季10斤比凯特芒果好","Products_JSON":{"ImgPath":["https://new401.bafangka.com/uploadfiles/wkbq6nc2kc/image/5dca5a05b7.jpg","https://new401.bafangka.com/uploadfiles/wkbq6nc2kc/image/5dca5af750.jpg","https://new401.bafangka.com/uploadfiles/wkbq6nc2kc/image/5dca5b051f.jpg","https://new401.bafangka.com/uploadfiles/wkbq6nc2kc/image/5dca5b0f77.jpg","https://new401.bafangka.com/uploadfiles/wkbq6nc2kc/image/5dca5b1dfb.jpg"]},"Products_PriceY":"59.00","Products_PriceX":"29.90","Products_SoldOut":0,"Products_Status":1,"Products_Count":10000,"Products_Sales":12300,"Products_Weight":"10.00","Products_IsVirtual":0,"Products_IsRecieve":0,"Products_IsHot":1,"Products_IsNew":1,"Products_IsRecommend":1,"Products_IsShippingFree":0,"Products_IsPaysBalance":1,"click_count":53,"pintuan_flag":1,"pintuan_people":5,"pintuan_start_time":1573542716,"pintuan_end_time":1605110400,"pintuan_pricex":"19.90","Products_BriefDescription":"越南玉芒大青芒新鲜水果包邮当季整箱甜心芒应季10斤比凯特芒果好","ImgPath":"https://new401.bafangka.com/uploadfiles/wkbq6nc2kc/image/5dca5a05b7.jpg","is_pintuan":1}];

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
