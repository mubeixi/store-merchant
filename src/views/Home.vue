<template>
  <div class="wrap">
    <header class="boxShadow mainHeader" style="height:0px;"></header>
    <div class="flex main">
      <div class="plugins">
        <plugins-component></plugins-component>
      </div>
      <div class="preview">
        <preview-component ref="preview" @setData="setDataEv"></preview-component>
      </div>
      <div class="setattr"  >
        <set-attr-component ref="setAttr"></set-attr-component>
      </div>
    </div>

    <div class="right" >
      <right-component></right-component>
    </div>

  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { mapState, mapActions, mapMutations } from 'vuex';
import SetAttrComponent from '@/components/SetAttrComponent.vue'; // @ is an alias to /src
import PreviewComponent from '@/components/PreviewComponent.vue';
import PluginsComponent from '@/components/PluginsComponent.vue';
import RightComponent from '@/components/RightComponent.vue';
import { moveEl } from '@/common/utils';
import {getSkinConfig,chooseShopSkin,getShopSkinList,setSkinConfig} from '@/common/fetch';

@Component({
  components: {
    PluginsComponent,
    SetAttrComponent,
    PreviewComponent,
    RightComponent,
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
.wrap
  width 1390px
  padding-top 100px
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
    width 540px
.right
  position fixed
  right 0px
  width 100px
  background white
  top 10%
  min-height 30%
  max-height 80%
  /*overflow-y scroll*/
  border 1px solid #e7e7e7
</style>
