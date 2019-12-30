<template>
  <div class="home-wrap">
    <wzw-finder :show="finderDialogInstance.visible"></wzw-finder>
    <div style="margin: 10% 50px">
      <wzw-editor ref="richtext" @on-content-change="onContentChange"></wzw-editor>
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

    import WzwEditor from "../components/editor/WzwEditor.vue"
    import WzwFinder from "../components/editor/WzwFinder.vue"
    import {ckeditorMixin} from '../common/mixin';


    @Component({
        mixins:[ckeditorMixin],
        components: {
            WzwEditor,WzwFinder
        },
        computed:{

        }
    })

    export default class Empty extends Vue {

        @State('finderDialogInstance') finderDialogInstance

        editorText


        onContentChange(val) {
            this.editorText = val
        }

        created(){
            console.log(window.vmobj)
        }

    }
</script>
<style lang="stylus" scoped>
</style>
