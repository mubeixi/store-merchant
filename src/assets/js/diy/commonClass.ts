import Vue from 'vue'

class Basis {
  constructor() {
    this.commonStyle = [];
    this.isEdit = true;
  }
}

Basis.prototype.vm = Vue;

export default Basis;
