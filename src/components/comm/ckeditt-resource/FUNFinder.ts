
let finderDialogInstance = window.finderDialogInstance
export class FUNFinder {
  constructor(opt){

  }

  static open({options,editor,callFn}){
    console.log(54543534,finderDialogInstance)
    finderDialogInstance.visible = true
    finderDialogInstance.callFn = callFn
  }

  // static select_fn(urls){
  //   finderDialogInstance.callFn.choose(urls)
  // }

}
