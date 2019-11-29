<template>
  <div class="wrap">
    <div class="container">
      <div class="tip">哎呀,你的页面走丢啦</div>
      <div class="action">
        <el-button @click="backFn" type="primary" class="back btn">返回</el-button>
        <el-button @click="goHome" class="home btn">首页</el-button>
      </div>
    </div>
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


    @Component({
        mixins:[],
        components: {

        }
    })


    export default class NotFound extends Vue {


        backFn(){
            window.history.back()
        }

        goHome(){
            window.location.href = location.origin
        }



    }
</script>
<style lang="stylus" scoped>
.container
  position absolute
  top 550px
  left 50%
  width 500px
  transform translate(-50%)
  .tip
    text-align center
    color white
    font-size 36px
    font-weight 300
    margin-bottom 20px
  .action
    display flex
    justify-content center
    .back
      margin-right 15px



.wrap
  position absolute
  left 0
  bottom 0
  right 0
  top 0
  background-image url("~@/assets/img/notfound.jpg")
  background-repeat no-repeat
  background-size cover
  background-position center
</style>

