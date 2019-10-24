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

export const setActiveAttr = ({commit}, data) => {
  // 这里除了修改之外，还需要去修改templDate的对应数据
  console.log('activeAttr data is change', data);
  commit('activeAttr', data);
};

export const setTemplateEditIndex = ({commit}, data) => {
  commit('templateEditIndex', data);
};


export const setTmplData = ({commit}, data) => {
  commit('tmplData', data);
};

export const setEditStatus = ({commit}, data) => {
  commit('editStatus', data);
};


export const setComponentTitle = ({commit}, data) => {
  commit('componentTitle', data);
};

export const setMode = ({commit}, data) => {
  commit('mode', data);
};

export const setSystem = ({commit}, data) => {
  commit('system', data);
};


