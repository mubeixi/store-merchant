import store from "../../store";
let finderDialogInstance = store.state.finderDialogInstance
const noop = ()=>{}
export class FUNFinder {

  constructor(opt){

  }

  /**
   *
   * @param options 控制选择的多少
   * @param editor
   * @param callFn
   */
  static open({options={},editor=null,callFn=noop}){


    finderDialogInstance.callFn = callFn

    let {limit=false,allow=['image','media']} = options;

    if(limit){
      finderDialogInstance.limit = limit
    }
    //默认允许图片和视频
    finderDialogInstance.allow = allow

    finderDialogInstance.visible = true
  }

  // static select_fn(urls){
  //   finderDialogInstance.callFn.choose(urls)
  // }

}
