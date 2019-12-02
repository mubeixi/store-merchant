<template>
  <div ref='renderContent'>

  </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';


    @Component({
        filters:{

        }
    })

    export default class MyRender extends Vue {

        @Prop({
            type:Object
        })
        row

        @Prop({
            type:Function,
            default:()=>{}
        })
        render

        mounted(){
            this.$refs.renderContent.innerHTML = this.render()

        }
    }

</script>

<style scoped>

</style>
