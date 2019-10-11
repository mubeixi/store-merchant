<template>
  <div>
    empty
  </div>
</template>

<script>
  import { deepCopy, mergeObject } from '../common/utils';

function copy(obj) {
    var newobj = {};
    for (var arr in obj) {
      newobj[arr] = obj[arr];
    }
    return newobj;
  }

  export default {
    name: 'Empty',
    data() {
      return {
        a: {
          child: function () {
          }
        },
        b: {
          child: {
            xx: 111,
            yy: 333,
            zz: 444,
            fun: {
              x: 33,
              y: 323,
              c: 555
            }
          }
        },
        c: {
          child: function () {
          }
        },
        d: {
          child: {
            xx: 111,
            yy: 333,
            zz: 444
          }
        }
      };
    },
    created() {

      let a = {value:{list:[]}},b = {value:{list:[{a:1},{a:2},{a:3},{a:4},{a:5},{a:6},{a:7}]}}
      let c = deepCopy(a,b)
      console.log(JSON.stringify(c))
      b.value.list[0].bbbbbbbbbbbbb=3333333333
      console.log(JSON.stringify(c))

    }
  };
</script>

<style scoped>

</style>
