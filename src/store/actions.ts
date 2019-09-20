// import {globalInitData, initData} from '../assets/js/fetch/index'
//
//
// export const setGlobalInitData = ({commit}) => {
//   globalInitData().then(res => {
//     commit('setGlobalInitData', res)
//   }).catch(e => {
//   })
// };

// @ts-ignore
import state from "@/store/state";

export const setActiveAttr = ({commit,data}) => {
  //这里除了修改之外，还需要去修改templDate的对应数据
  commit('activeAttr',data)
}

export const setTemplateEditIndex = ({commit,data}) => {
  commit('templateEditIndex',data)
}


export const setTmplData = ({commit,data}) => {
  commit('tmplData',data)
}
