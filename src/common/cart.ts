import {fun} from "@/common/index";
import {findArrayIdx} from "@/common/utils";

/**
 * 进货的购物车类
 */
export class Cart {
  lists = []

  constructor(list:any=[]){
    this.lists = list
  }

  getLen(){
    return this.lists.length
  }

  add(item){
    let key_val_arr = {Products_ID:item.Products_ID}
    if(item.Productsattrstrval){
      key_val_arr.Productsattrstrval = item.Productsattrstrval
    }
    let isHas = findArrayIdx(this.lists,key_val_arr,true)
    if(isHas === false){
      this.lists.push({num:1,...item})
    }else{
      //不能用item,因为会拿不到num
      this.plus(isHas.val)
    }

    return true

  }

  minus(item){
    let key_val_arr = {Products_ID:item.Products_ID}
    if(item.Productsattrstrval){
      key_val_arr.Productsattrstrval = item.Productsattrstrval
    }
    let isHas = findArrayIdx(this.lists,key_val_arr)
    if(isHas!==false){
      this.setCount(isHas,item.num-1)
    }

  }

  plus(item){
    let key_val_arr = {Products_ID:item.Products_ID}
    if(item.Productsattrstrval){
      key_val_arr.Productsattrstrval = item.Productsattrstrval
    }
    let isHas = findArrayIdx(this.lists,key_val_arr)
    if(isHas!==false){
      this.setCount(isHas,(item.num+1))
    }
  }


  remove(item){
    //获取索引
    let key_val_arr = {Products_ID:item.Products_ID}
    if(item.Productsattrstrval){
      key_val_arr.Productsattrstrval = item.Productsattrstrval
    }
    let isIdx = findArrayIdx(this.lists,key_val_arr)
    console.log('需要删除的索引是',isIdx)
    if(isIdx!==false){

      this.lists.splice(isIdx,1)
    }

  }

  clear(){
    this.lists = []
  }


  setCount(idx,num){
    console.log(idx,num)
    //需要为数值
    if(isNaN(num) || parseInt(num)!=num|| num==0){
      fun.error({msg:'选中库存需为正整数数值'})
      return;
    }
    //不能大于库存
    if(num>this.lists[idx].count){
      fun.error({msg:'库存不足'})
      return;
    }
    this.lists[idx].num = num
  }



}
