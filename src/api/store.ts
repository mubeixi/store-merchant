/**
 *
 * 所有门店单独用到的api列表放在这个模块里面。如果是两边共用的，那么copy一份，加上ByStore。 比如 getProductList==>getProductListByStore
 * 预计后面门店功能会加强，可以提前把api按模块分开（因为接口过多，所以system里面仍然放在common/fetch.js中)
 *
 */
import {fetch} from "../common/fetch";

// export const getFileList = (data:object={},options:any=false)=> fetch('getFolderDir', data, options)
