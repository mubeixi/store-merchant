<template>
  <div class="wrap">
    <header class="boxShadow mainHeader" style="height:0px;"></header>
    <div class="flex main">
      <div class="plugins">
        <plugins-component></plugins-component>
      </div>
      <div class="preview">
        <preview-component @setData="setDataEv"></preview-component>
      </div>
      <div class="setattr">
        <set-attr-component></set-attr-component>
      </div>
    </div>

  </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import SetAttrComponent from '@/components/SetAttrComponent.vue'; // @ is an alias to /src
    import PreviewComponent from "@/components/PreviewComponent.vue";
    import PluginsComponent from "@/components/PluginsComponent.vue";
    import {mapState,mapActions,mapMutations} from "vuex";

    @Component({
        components: {
            PluginsComponent,
            SetAttrComponent,
            PreviewComponent
        },
        methods:{
            //这个数据一直往上传，这么辛苦
            setDataEv(data) {
                //this.activeObj = data
            },
        },
        computed:{
            ...mapState(['activeAttr','editStatus'])
        }
    })
    export default class Home extends Vue {


        created() {

        }
    }
</script>
<style lang="stylus" scoped>
.wrap
  width 1390px
  margin 100px auto 0
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

</style>
