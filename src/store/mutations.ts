import Vue from 'vue'

export const activeAttr = function (state: { activeAttr: any; }, value: any) {
  state.activeAttr = value
};

export const attrData = function (state: any, value: any) {
  state.activeAttr.attrData = value
};

export const editStatus = function (state: { editStatus: any; }, value: any) {
  state.editStatus = value
};


