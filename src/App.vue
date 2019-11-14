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
  height: auto;
}
#canvas{
  .tab{
    *::-webkit-scrollbar{
      display:none !important;
    }
  }
  *::-webkit-scrollbar{
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


.upload.mini{

  &.is_full{
    .el-upload--picture-card{
      display: none !important;
    }
  }
  .el-upload--picture-card{
    width: 80px !important;
    height: 80px !important;
    line-height: 80px !important;
  }
  .el-upload-list--picture-card{

    .el-upload-list__item{
      width: 80px !important;
      height: 80px !important;
      //position: revert;

      img{
        /*position: absolute;*/
        /*top: 50%;*/
        /*transform: translateY(-50%);*/
        /*height: auto;*/

      }
    }
  }
}

</style>
