<template>
  <div class="home-wrap">
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

    import WzwEditor from "../components/comm/WzwEditor.vue"


    @Component({
        mixins:[],
        components: {
            WzwEditor
        }
    })

    export default class Empty extends Vue {
        editorText

        onContentChange(val) {
            this.editorText = val
        }

    }
</script>
<style lang="stylus" scoped>
</style>
