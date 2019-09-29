<template>
<div>
  empty
</div>
</template>

<script>
  import {deepCopy} from '@/common/utils';
  function copy(obj) {
    var newobj={};
    for(var arr in obj){
      newobj[arr]=obj[arr]
    }
    return newobj;
  }
  export default {
    name: 'Empty',
    data(){
      return {
        a:{child:function(){}},
        b:{child:{xx:111,yy:333,zz:444,fun:{x:33,y:323,c:555}}},
        c:{child:function(){}},
        d:{child:{xx:111,yy:333,zz:444}}
      }
    },
    created() {
      //eg1 修改a.child 但是b不跟着变动
     this.$set(this,'a',this.b)
      this.a.ccc=333

    }
  };
</script>

<style scoped>

</style>
