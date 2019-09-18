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
export const setActiveAttr = ({commit,data}) => {
  commit('activeAttr',data)
}
