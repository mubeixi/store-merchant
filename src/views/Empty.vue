<template>
  <div class="home-wrap">
    <div style="margin: 90px">
      <wzw-editor />
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
    import WzwEditor from '../components/editor/WzwEditor';

    @Component({
        components: {
            WzwEditor
        }
    })
    export default class Empty extends Vue {

        async created(){





        }

    }
</script>
<style lang="stylus" scoped>
</style>
