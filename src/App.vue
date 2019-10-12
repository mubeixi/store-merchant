<template>
  <div id="app">
    <router-view/>
  </div>
</template>
<style lang="stylus">
  @import "assets/css/app.styl";

</style>
<style lang="less">

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
</style>
