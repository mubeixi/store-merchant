<template>
  <div id="app">
    <router-view/>
  </div>
</template>
<style lang="stylus">
  @import "assets/css/app.styl";

</style>
<style lang="less">

  .el-carousel__container{
    /*min-height: 10px;*/
    height: auto;
  }
  #canvas{
    .tab{
      *::-webkit-scrollbar{
        display:none !important;
      }
    }
    *::-webkit-scrollbar{
      /*display:none !important;*/
    }
  }

  //全局新增 element  input位数字是不显示加减按钮
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  input[type="number"]{
    -moz-appearance: textfield;
  }
</style>
