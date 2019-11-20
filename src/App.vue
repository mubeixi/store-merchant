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

.wzw-table th {
  color: #333 !important;
    background-color: #F9FAFC !important;
    border: none !important;
    border-top: 1px solid #EAEAEA !important;
    border-left: 1px solid #EAEAEA !important;
}
.wzw-table tr th:nth-last-of-type(2) {
  border-right: 1px solid #EAEAEA !important;
}
.wzw-table {
  .el-table__body tr td:nth-last-child(1) {
    border-right: 1px solid #EAEAEA !important;
  }
  .el-table td {
    border-bottom: 0;
    border-top: 1px solid #eaeaea !important;
    border-left: 1px solid #eaeaea !important;
  }
  .el-table__body tr:nth-last-child(1) {
    border-bottom: 1px solid #eaeaea !important;
  }
  .el-table__empty-block {
    border: 1px solid #EAEAEA !important;
    box-sizing: border-box !important;
  }
  .el-table--scrollable-x .el-table__body-wrapper {
    overflow-x: hidden !important;
  }
}
</style>
