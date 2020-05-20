/**
 *
 * 所有门店单独用到的api列表放在这个模块里面。如果是两边共用的，那么copy一份，加上ByStore。 比如 getProductList==>getProductListByStore
 * 预计后面门店功能会加强，可以提前把api按模块分开（因为接口过多，所以system里面仍然放在common/fetch.js中)
 *
 */
import {fetch} from "../common/fetch";


export const getStoreListByStore = (data:object={},options:any=false) => fetch('get_store_list', {...data,env:'store'}, options);


export const getStoreDetail = (data:object={},options:any=false) => fetch('get_store_detail', {...data,env:'store'}, options);

//获取门店商品列表
export const getProductsByStore = (data:object={},options:any=false) => fetch('get_products', {...data,env:'store'}, options);


export const getProductCategoryByStore = (data:object={},options:any=false) => fetch('pro_cate', {...data,env:'store'}, options)


export const storeProductBack = (data:object={},options:any=false) => fetch('store_prod_back_submit', {...data,env:'store'}, options);


export const getProductAttsByStore = (data:object={},options:any=false) => fetch('get_product_atts', {...data,env:'store'}, options);

export const getShippingTemplateByStore = (data:object={},options:any=false) => fetch('getShippingTemplate', {...data,env:'store'}, options)


export const getProductListByStore = (data:object={},options:any=false) => fetch('get_prod', {...data,env:'store'}, options)


export const updateCart = (data:object={},options:any=false) => fetch('update_cart', {...data,env:'store'}, options);

export const getCartList = (data:object={},options:any=false) => fetch('get_cart', {...data,env:'store'}, options);

export const delCart = (data:object={},options:any=false) => fetch('del_cart', {...data,env:'store'}, options);

export const getPifaProductList = (data:object={},options:any=false) => fetch('get_pifa_store_prod', {...data,env:'store'}, options)

export const createOrder = (data:object={},options:any=false) => fetch('create_order', {...data,env:'store'}, options)

export const orderPay = (data:object={},options:any=false) => fetch('order_pay', {...data,env:'store'}, options);


export const calcApplyMoneyCount = (data:object={},options:any=false) => fetch('store_pifa_order_calc', {...data,env:'store'}, options);
//取消进货单
export const cancalStorePurchaseApply = (data:object={},options:any=false) => fetch('store_pifa_order_cancel', {...data,env:'store'}, options);
//批发——采购方操作
export const changeStoreApplyChannel = (data:object={},options:any=false) => fetch('store_pifa_order_change_wholesaler', {...data,env:'store'}, options);
export const delStorePurchaseApply = (data:object={},options:any=false) => fetch('store_pifa_order_del', {...data,env:'store'}, options);
//进货单相关处理
export const getStorePurchaseApply = (data:object={},options:any=false) => fetch('get_store_pifa_apply_order', {...data,env:'store'}, options);
export const getStorePurchaseApplyInfo = (data:object={},options:any=false) => fetch('get_store_pifa_order_detail', {...data,env:'store'}, options);
//撤回进货单
export const recallStorePurchaseApply = (data:object={},options:any=false) => fetch('store_pifa_order_recall', {...data,env:'store'}, options);
export const store_pifa_order_completed = (data:object={},options:any=false) => fetch('store_pifa_order_completed', {...data,env:'store'}, options);

export const subStorePurchaseApply = (data:object={},options:any=false) => fetch('store_pifa_order_submit', {...data,env:'store'}, options);



export const get_store_prod_back_order_detail = (data:object={},options:any=false) => fetch('get_store_prod_back_order_detail', {...data,env:'store'}, options);

//获取物流公司列表
export const getShippingListByStore = (data:object={},options:any=false) => fetch('get_shipping', {...data,env:'store'}, options);

export const store_prod_back_order_cancel = (data:object={},options:any=false) => fetch('store_prod_back_order_cancel', {...data,env:'store'}, options);

export const store_prod_back_order_send = (data:object={},options:any=false) => fetch('store_prod_back_order_send', {...data,env:'store'}, options);

export const store_prod_back_order_confirm = (data:object={},options:any=false) => fetch('store_prod_back_order_confirm', data, options);

export const storeProductBackOrderList = (data:object={},options:any=false) => fetch('get_store_prod_back_order', {...data,env:'store'}, options);
