import Vue from 'vue'
import store from "@/store";


class Basis {
  constructor() {
    this.commonStyle = [];
    this.isEdit = true;
  }
}

//需要重新挂一下
Basis.prototype.vm = Vue;
Basis.prototype.vm.$store = store;

export default Basis;
