<template>
  <div class="home-wrap">

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

    /**
     * 1.async 返回一个promise，如果函数里面没有显示的reject、resolve的话，那么该函数返回一个属于pedding状态下的promise（这样会导致内存不断被浪费)
     *2.async 中如果有return 那么不管return什么，都等效于 promsie.resolve(xxx)
     *  return null<===>retunn promise.resolve(null)
     *  return undefined<===>retunn promise.resolve(undefined)
     *  return false<===>retunn promise.resolve(false)
     *3.async 要reject的话，可以 return promise.reject('promise reject description')  //手动抛出异常的时候，不需要new Error， 后面catch捕获的时候用new Error即可
     *4.
     */
    const asynchronous = async(a)=>{

        return Promise.resolve(a*a)

        //Promise.reject('出错啦')
        //不带return所以上面写的Promise.reject没啥用。这里会隐式返回一个undefined的resolve状态promise
        // [[PromiseStatus]]: "resolved"
        // [[PromiseValue]]: undefined

        //return Promise.reject('出错啦')
        //带return 则表示显示返回一个
    }



    @Component
    export default class Empty extends Vue {


        async created(){



        }

    }
</script>
<style lang="stylus" scoped>
</style>
