<template>
  <div class="page-wrap">
    <div class="container-wrap">
      <el-form label-width="100px" class="form">
        <el-form-item label="进货渠道:" prop="channel">
          <el-select  v-model="formData.channel" placeholder="请选择类型" style="width: 100%" >
            <template v-for="(item,idx) of channels">
              <el-option  :label="item.name" :value="item.id" ></el-option>
            </template>
          </el-select>
        </el-form-item>

        <el-form-item label=" " prop="store_no" v-show="formData.channel==1">
          <div class="flex">
            <el-input  v-model="formData.store_no" placeholder="请输入门店编码" ></el-input>
            <div class="space"></div>
            <el-button @click="dialogStoreShow=true">筛选门店</el-button>
          </div>
        </el-form-item>
      </el-form>
      <el-button :loading="loading" class="btn"  @click="subSearch">搜索</el-button>
    </div>

    <bind-store-component
      top="12vh"
      @cancel="bindStoreCancel"
      @success="bindStoreSuccessCall"
      :single="true"
      :get_top="1"
      :self_store_id="self_store_id"
      :show="dialogStoreShow"
    />

  </div>
</template>

<script lang="ts">

    import {
        Component,
        Vue
    } from 'vue-property-decorator';
    import {
        Action,
        State
    } from 'vuex-class'
    import {fun} from '../common';
    import {getStoreDetail} from '@/common/fetch';
    // import {City} from '../common/city';
    import BindStoreComponent from '../components/comm/BindStoreComponent'
    import Cookies from 'js-cookie';


    @Component({
        components:{BindStoreComponent},
        watch:{}
    })
    export default class StoreChannel extends Vue {

    self_store_id = Cookies.get('Stores_ID')
    dialogStoreShow = false

    bindStoreCancel(){
        this.dialogStoreShow = false
    }
    bindStoreSuccessCall(store_info){

        console.log(store_info)
        if(store_info && store_info.hasOwnProperty('stores_sn')){
            this.formData.store_no = store_info.stores_sn
            this.dialogStoreShow = false

            //直接跳转了
            this.subSearch()
        }else{
            fun.error({msg:'店铺选择错误'})
        }

    }

    loading = false
    formData = {
        store_no:null,
        channel:1,

    }

    channels = [
        {id:1,name:'门店进货'},
        {id:2,name:'平台进货'},
    ]

    async subSearch(){

        if(!this.formData.channel){
            fun.error({msg:'渠道必选'});
            return;
        }

        if(this.formData.channel === 2){
            this.$router.push({
                name:'StorePurchase',
                query:this.formData
            })
        }

        if(this.formData.channel===1){

            if(!this.formData.store_no){
                this.dialogStoreShow = true
                //fun.error({msg:'门店编码必填'});
                return;
            }

            this.loading = true
            let rt = false
            await getStoreDetail({store_sn:this.formData.store_no,User_ID:null,store_id:null}).then(res=>{
                rt =true
            }).catch(e=>{
                fun.error({msg:'门店编码不正确'})
            })
            this.loading = false

            if(rt){
                this.$router.push({
                    name:'StorePurchase',
                    query:this.formData
                })
            }

        }

    }

    created(){
        getStoreDetail({store_id:this.self_store_id}).then(res=>{
            //去掉平台

            !res.data.allow_from_plat && this.channels.splice(1)
        })
        // this.province_list = City.getProvinceList()
    }



    }
</script>
<style lang="stylus" scoped>

.space
  width 10px
.page-wrap
  width 100%
  height 100vh
  background-position center bottom
  background-size 100% auto
  background-repeat no-repeat
  background-image url("~@/assets/img/store/join_bg.png")
.container-wrap
  position fixed
  left 50%
  top 12%
  transform translateX(-50%)
  width 848px
  height 602px
  box-shadow 0 0 49px 14px rgba(0, 37, 157, 0.15)
  .form
    margin 129px 186px 100px 147px
  .btn
    margin 0 auto
    display block
    padding 0
    width 420px
    height 50px
    line-height 50px
    background #F43131
    border-radius 6px
    color white
    text-align center
    font-size 18px
    cursor pointer
</style>


