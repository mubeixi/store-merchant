export const activeAttr = function (state: { activeAttr: any; }, value: any) {
  // window.ActiveAttrObj = value;
  // console.log(22222222,'storesotre')
  state.activeAttr = value;
  // if(!window.ActiveAttrObj)window.ActiveAttrObj = state.activeAttr;//绑定下
};

export const templateEditIndex = function (state: any, value: any) {
  state.templateEditIndex = value;
};

export const attrData = function (state: any, value: any) {
  state.activeAttr.attrData = value;
};

export const editStatus = function (state: { editStatus: any; }, value: any) {
  state.editStatus = value;
};

export const tmplData = function (state: any, value: any) {
  state.tmplData = value;
};

export const tabIndex = function (state: any, value: any) {
  state.tabIndex = value;
};

export const componentTitle = function(state:any,value:any){
  state.componentTitle = value
}

export const mode = function(state:any,value:any){
  state.mode = value
}

export const system = function(state:any,value:any){
  state.system = value
}

// export const eTitle = function (state: any, value: any) {
//   state.eTitle = value
// };
