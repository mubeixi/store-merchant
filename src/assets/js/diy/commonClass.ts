import Vue from 'vue'
import store from "@/store";


class Basis {

  commonStyle = [];
  isEdit = true;
  activeIndex:number = 0;

  fn = ()=>1

  constructor() {


  }

  fun1(){
    console.log('32223')
  }


}

//需要重新挂一下
// @ts-ignore
Basis.prototype.vm = Vue;

// @ts-ignore
Basis.prototype.vm.$store = store;

export default Basis;
