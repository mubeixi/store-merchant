<template>
  <div class="wrap">
    <header class="boxShadow mainHeader" style="">
      <el-button type="primary" size="small">保存并继续</el-button>
    </header>
    <div class="flex main">
      <div class="plugins">
        <plugins-component></plugins-component>
      </div>
      <div class="preview">
        <preview-component ref="preview" @setData="setDataEv"></preview-component>
      </div>
      <div class="setattr">
        <set-attr-component ref="setAttr"></set-attr-component>
      </div>
    </div>

    <div class="right">
      <right-component></right-component>
    </div>

  </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {mapState} from 'vuex';
    import SetAttrComponent from '@/components/SetAttrComponent.vue'; // @ is an alias to /src
    import PreviewComponent from '@/components/PreviewComponent.vue';
    import PluginsComponent from '@/components/PluginsComponent.vue';
    import RightComponent from '@/components/RightComponent.vue';
    import {moveEl} from '@/common/utils';

    import {isDev} from '../common/env';


    @Component({
        components: {
            PluginsComponent,
            SetAttrComponent,
            PreviewComponent,
            RightComponent,
        },
        data() {
            return {
                isDev: isDev
            }
        },
        methods: {
            // 这个数据一直往上传，这么辛苦
            setDataEv(data) {
                // this.activeObj = data
            },
        },
        computed: {
            ...mapState(['activeAttr', 'editStatus']),
        },
        mounted() {
            // 右侧如果内容过多，可以用滚动栏
            moveEl(this.$refs.setAttr.$el);
        },
    })
    export default class Home extends Vue {
        created() {

            console.log(this)
            //模拟设置一下
            // getShopSkinList().then(res=>{
            //
            //     chooseShopSkin({Skin_ID:res.data.shop_skin_list[0].Skin_ID}).then(r=>{
            //
            //     })
            // })
        }
    }
</script>
<style lang="stylus" scoped>
  .mainHeader
    padding 16px 0
    box-sizing border-box
    text-align right
    border-bottom 1px solid #e7e7e7

  .wrap
    padding-top 0px
    margin 0px auto 0

    .plugins
      width 272px
      height 600px
      margin-right 74px

    .preview
      position relative
      width 377px
      margin-right 90px

    .setattr
      height calc(100vh - 200px)
      /*overflow-y scroll*/
      overflow-x hidden
      width 540px
      padding-right 20px

  .right
    position fixed
    z-index 999
    right 0px
    width 140px
    background white
    bottom 0
    top 100px
    /*overflow-y scroll*/
    border 1px solid #e7e7e7


  /*webkit内核*/
  //.setattr::-webkit-scrollbar {
  //  width:0px;
  //  height:0px;
  //}
</style>
