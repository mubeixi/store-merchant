import Vue from 'vue';
import {baseApiUrl} from './env';
import {hexMD5} from "@/common/tool/md5";
import {Loading} from "element-ui";
import {ls} from "@/common/tool/ls";

import Cookie from 'js-cookie';


require('./tool/base64');

window.funLoading = false

export const fetch = function (act: String, param: Object = {}, options = false, url: String = '/api/little_program/shopconfig.php', method: String = 'post') {

  // console.log(param)
  if (!act) Vue.$fun.warning('获取信息失败');

  // @ts-ignore
  param.act = act;
  param.env = 'system';
  // param.Users_Account = get_Users_Account();

  // console.log('生效了')
  // console.log(param.hasOwnProperty('access_token'),'dddddddddddddd')
  if(!param.hasOwnProperty('access_token')){
    // @ts-ignore
    param.access_token = GET_ACCESS_TOKEN()
  }


  if(!param.Users_ID){
    param.Users_ID = get_Users_ID();
  }
  // @ts-ignore
  if(!param.hasOwnProperty('User_ID')){
    param.User_ID = get_User_ID();
  }
  // @ts-ignore
  if(!param.hasOwnProperty('store_id')){
    param.store_id = get_Stores_ID();
  }
  // param.appid = get_Appid();

  // console.log(param)
  // 数据加密
  let data = createToken(param);

  //保持签名通过，同时支持传空字符串
  Object.assign(data,param)

  // console.log(data)

  // console.log(process.env.VUE_APP_API_BASE_URL)
  url = (process.env.NODE_ENV === 'production' ? baseApiUrl : '') + url;
  // url = (process.env.NODE_ENV === 'production' ? process.env.VUE_APP_API_BASE_URL : '') + url;
  // url = (process.env.NODE_ENV === 'production' ? window.pro_base_apiurl : '') + url;
  // console.log(url, param);

  if (options) {
    window.funLoading = Loading.service(options)
  }


  return new Promise(((resolve, reject) => {

    Vue.http[method](url, data, options).then(res=>{
      if(res.data.errorCode === 0){
        resolve(res.data)
      }else{
        reject(res.data)
      }

    },error=>{
      reject(error)
    })

  }));

};


//获取权益卡
export const getCouponLists = (data:object={},options:any=false)=> fetch('getCouponList', data, options)
//获取权益卡
export const getRightsCard = (data:object={},options:any=false)=> fetch('getRightsCard', data, options)

//获取同城配送参数
export const getCityExpressConfig = (data:object={},options:any=false)=> fetch('getCityExpressConfig', data, options)
//同城配送配置编辑
export const opCityExpressConfig = (data:object={},options:any=false)=> fetch('opCityExpressConfig', data, options)
//开启和关闭对应同城配送服务商
export const cityExpressProvider = (data:object={},options:any=false)=> fetch('cityExpressProvider', data, options)

export const getCommonConfig = (data:object={},options:any=false)=> fetch('shopconfig', data, options)

export const getFileList = (data:object={},options:any=false)=> fetch('getFolderDir', data, options)

export const createDirectory = (data:object={},options:any=false)=> fetch('createFolder', data, options)

export const getAliyunOssSign = (data:object={},options:any=false)=> fetch('getVaildSign', data, options)

//export const getDirectoryList = (act='fun',data:object={},options:any=false)=> fetch(act, data, options,'http://localhost:9100/directory')

export const commonReq = (act,data:object={},options:any=false)=> fetch(act, data, options)

export const login = (data:object={},options:any=false) => fetch('users_login', data, options)

export const getCouponList = (data:object={},options:any=false) => fetch('get_unaccalimed_coupon', data, options)

export const getProductDetail = (data:object={},options:any=false) => fetch('prod_detail', data, options)

export const getProductList = (data:object={},options:any=false) => fetch('get_prod', data, options)


export const getPifaProductList = (data:object={},options:any=false) => fetch('get_pifa_store_prod', data, options)

export const createOrder = (data:object={},options:any=false) => fetch('create_order', data, options)

export const getSelfStoreProd = (data:object={},options:any=false) => fetch('get_self_store_prod', data, options)

export const getShopSkinList = (data:object={},options:any=false) => fetch('get_shopskin', data, options)

export const chooseShopSkin = (data:object={},options:any=false) => fetch('choose_shopskin', data, options)

export const addPoster = (data:object={},options:any=false) => fetch('addPoster', data, options)

export const getPosterList = (data:object={},options:any=false) => fetch('getPosterList', data, options)

export const delPoster = (data:object={},options:any=false) => fetch('delPoster', data, options)

export const getPosterDetail = (data:object={},options:any=false) => fetch('getPosterDetail', data, options)

export const convertImageByBase64 =  (data:object={},options:any=false) => fetch('convertImageBase64', data, options)

//获取商城的配置
//get_shophome
export const getSkinConfig = (data:object={},options:any=false) => fetch('get_skin_data', data, options)

export const getDiySkinConfig = (data:object={},options:any=false) => fetch('get_makeup_home_data', data, options)


//获取自定义页面的列表
export const getDiyPageList = (data:object={},options:any=false) => fetch('get_makeup_home', data, options)

//获取自定义URL列表
export const getDiyUlrList = (data:object={},options:any=false) => fetch('get_makeup_home', data, options)

//获取系统url列表
export const getSystemUrl = (data:object={},options:any=false) => fetch('system_url', data, options)

//获取diy url列表
export const getDiyUrl = (data:object={},options:any=false) => fetch('system_diy_url', data, options)

//更新商城的配置
//update_shophome
export const setSkinConfig = (data:object={},options:any=false) => fetch('save_skin_date', data, options)

export const setDiySkinConfig = (data:object={},options:any=false) => fetch('save_makeup_home_data', data, options)

//秒杀列表
export const getFlashSaleList = (data:object={},options:any=false) => fetch('get_flashsale', data, options)

//获取限时抢购
export const getSpikeList = (data:object={},options:any=false) => fetch('get_spike_list', data, options)
//获取物流模板
export const getShippingTemplate = (data:object={},options:any=false) => fetch('getShippingTemplate', data, options)



export const getSpikeProd = (data:object={},options:any=false) => fetch('get_spike_prod', data, options)

export const getProductCategory = (data:object={},options:any=false) => fetch('pro_cate', data, options)

export const getUsersInfo = (data:object={},options:any=false) => fetch('get_users_info', data, options)

export const getProductCountInfo  = (data:object={},options:any=false) => fetch('get_users_info', data, options);

export const uploadImgByBase64 = (data:object={},options:any=false) => fetch('upload_image', data, options);

export const uploadFileFn = (data:object={},options:any=false) => fetch('upload_image', data, options);

export const getSysuser = (data:object={},options:any=false) => fetch('get_sysuser', data, options);

export const getSysorders = (data:object={},options:any=false) => fetch('get_sysorders', data, options);

export const getSysgrowths = (data:object={},options:any=false) => fetch('get_sysgrowths', data, options);

export const getSysbalances = (data:object={},options:any=false) => fetch('get_sysbalances', data, options);

export const getSysintegrals = (data:object={},options:any=false) => fetch('get_sysintegrals', data, options);

export const getSysloginLogs = (data:object={},options:any=false) => fetch('get_syslogin_logs', data, options);

export const getSysstatistics = (data:object={},options:any=false) => fetch('get_sysstatistics', data, options);

export const getAddress = (data:object={},options:any=false) => fetch('get_address',data,options);

export const getStoreList = (data:object={},options:any=false) => fetch('get_store_list', data, options);

export const getStoreDetail = (data:object={},options:any=false) => fetch('get_store_detail', data, options);
//批发——采购方操作
export const changeStoreApplyChannel = (data:object={},options:any=false) => fetch('store_pifa_order_change_wholesaler', data, options);

export const updateStoreApplyGoodsNum = (data:object={},options:any=false) => fetch('store_pifa_order_edit', data, options);


export const calcApplyMoneyCount = (data:object={},options:any=false) => fetch('store_pifa_order_calc', data, options);


export const getOrderExpress = (data:object={},options:any=false) => fetch('get_order_express', data, options);

export const orderPay = (data:object={},options:any=false) => fetch('order_pay', data, options);

//取消进货单
export const cancalStorePurchaseApply = (data:object={},options:any=false) => fetch('store_pifa_order_cancel', data, options);

//撤回进货单
export const recallStorePurchaseApply = (data:object={},options:any=false) => fetch('store_pifa_order_recall', data, options);

export const store_pifa_order_completed = (data:object={},options:any=false) => fetch('store_pifa_order_completed', data, options);

export const subStorePurchaseApply = (data:object={},options:any=false) => fetch('store_pifa_order_submit', data, options);

export const delStorePurchaseApply = (data:object={},options:any=false) => fetch('store_pifa_order_del', data, options);

//批发——发货方的操作
export const refuseStorePurchaseApply = (data:object={},options:any=false) => fetch('store_pifa_order_reject', data, options);

//获取批发的订单
export const getStorePurchaseSales = (data:object={},options:any=false) => fetch('get_store_pifa_assign_order', data, options);

//购物车
export const updateCart = (data:object={},options:any=false) => fetch('update_cart', data, options);

export const getCartList = (data:object={},options:any=false) => fetch('get_cart', data, options);

export const delCart = (data:object={},options:any=false) => fetch('del_cart', data, options);

//获取进货单详情

export const getStorePurchaseApplyInfo = (data:object={},options:any=false) => fetch('get_store_pifa_order_detail', data, options);

//进货单相关处理
export const getStorePurchaseApply = (data:object={},options:any=false) => fetch('get_store_pifa_apply_order', data, options);

//产品添加编辑所需配置
export const systemProdConfig = (data:object={},options:any=false) => fetch('system_prod_config', data, options);
//产品添加
export const systemOperateProd = (data:object={},options:any=false) => fetch('system_operate_prod', data, options);
//获取产品具体信息
export const systemProdDetail = (data:object={},options:any=false) => fetch('system_prod_detail', data, options);
//获取卡密列表
export const virtualCardList = (data:object={},options:any=false) => fetch('virtual_card_list', data, options);

//获取卡密类型
export const virtualCardType = (data:object={},options:any=false) => fetch('virtual_card_type', data, options);

//获取会员日营销详情
export const getScene = (data:object={},options:any=false) => fetch('get_scene', data, options);
//获取场景营销列表
export const getScenes = (data:object={},options:any=false) => fetch('get_scenes', data, options);
//终止场景营销
export const stopScene = (data:object={},options:any=false) => fetch('stop_scene', data, options);
//场景营销初始化
export const initScenes = (data:object={},options:any=false) => fetch('init_scenes', data, options);
//获取赠品列表
export const getGivingGifts = (data:object={},options:any=false) => fetch('get_giving_gifts', data, options);
//获取标签管理列表
export const getTags = (data:object={},options:any=false) => fetch('get_tags', data, options);
//删除标签
export const delTag = (data:object={},options:any=false) => fetch('del_tag', data, options);
//新增标签
export const addTag = (data:object={},options:any=false) => fetch('add_tag', data, options);
//获取编辑标签
export const getTag = (data:object={},options:any=false) => fetch('get_tag', data, options);


//获取人群列表
export const getCrowds = (data:object={},options:any=false) => fetch('get_crowds', data, options);
//删除人群
export const delCrowd = (data:object={},options:any=false) => fetch('del_crowd', data, options);
//初始化人群
export const initCrowd = (data:object={},options:any=false) => fetch('init_crowd', data, options);
//新增人群
export const addCrowd = (data:object={},options:any=false) => fetch('add_crowd', data, options);
//获取人群详情
export const getCrowd = (data:object={},options:any=false) => fetch('get_crowd', data, options);
//赠送优惠券列表
export const getGivingCoupons = (data:object={},options:any=false) => fetch('get_giving_coupons', data, options);

//获取短信模板
export const smsGetTemplates = (data:object={},options:any=false) => fetch('sms_get_templates', data, options);
//新增短信模板
export const smsAddTemplate = (data:object={},options:any=false) => fetch('sms_add_template', data, options);
//删除短信模板
export const smsDelTemplate = (data:object={},options:any=false) => fetch('sms_del_template', data, options);
//新增短信站内信
export const addBatch = (data:object={},options:any=false) => fetch('add_batch', data, options);

//给人群打标签
export const tagCrowd = (data:object={},options:any=false) => fetch('tag_crowd', data, options);

//门店产品发起退货
export const storeProductBack = (data:object={},options:any=false) => fetch('store_prod_back_submit', data, options);

export const storeProductBackOrderList = (data:object={},options:any=false) => fetch('get_store_prod_back_order', data, options);

export const store_prod_back_order_cancel = (data:object={},options:any=false) => fetch('store_prod_back_order_cancel', data, options);

export const get_store_prod_back_order_detail = (data:object={},options:any=false) => fetch('get_store_prod_back_order_detail', data, options);

export const store_prod_back_order_send = (data:object={},options:any=false) => fetch('store_prod_back_order_send', data, options);

export const store_prod_back_order_confirm = (data:object={},options:any=false) => fetch('store_prod_back_order_confirm', data, options);

//查看商品规格数量
export const getProductAtts = (data:object={},options:any=false) => fetch('get_product_atts', data, options);

//获取物流公司列表
export const getShippingList = (data:object={},options:any=false) => fetch('get_shipping', data, options);

//获取分销商等级
export const systemLevelList = (data:object={},options:any=false) => fetch('system_level_list', data, options);

//分销 贡献奖规则列表查询
export const getDistributorContribute = (data:object={},options:any=false) => fetch('contributeRules', data, options);

export const createdDistributorContribute = (data:object={},options:any=false) => fetch('createContributeRule', data, options);

export const beginDistributorStatistics = (data:object={},options:any=false) => fetch('beginStatistics', data, options);

export const getDistributorContributeDetail = (data:object={},options:any=false) => fetch('getContributeDetail', data, options);


export const sendDistributorContributeMoney = (data:object={},options:any=false) => fetch('sendContributeMoney', data, options);

//获取文章列表url
export const systemArticleUrl = (data:object={},options:any=false) => fetch('system_article_url', data, options);

//获取门店商品列表
export const getProducts = (data:object={},options:any=false) => fetch('get_products', data, options);

//给商品type 1:批量下架 2：批量上架 3：批量生成二维码 4：批量设置佣金
export const batchSetting = (data:object={},options:any=false) => fetch('batch_setting', data, options);

//删除商品列表中的某个商品
export const delProduct = (data:object={},options:any=false) => fetch('del_product', data, options);

//查看分销商佣金列表
export const lookDissetting = (data:object={},options:any=false) => fetch('look_dissetting', data, options);

// 获取初始化数据
export const initScene = (data:object={},options:object={}) => fetch('init_scene', data , options);
//更新活动信息
export const addScene = (data:object={},options:object={}) => fetch('add_scene', data , options);

//设置分销商等级
export const systemLevelAdd = (data:object={},options:any=false) => fetch('system_level_add', data , options);
//编辑分销商等级
export const systemLevelEdit = (data:object={},options:any=false) => fetch('system_level_edit', data , options);
//获取分销商等级详情
export const systemLevelDetail = (data:object={},options:any=false) => fetch('system_level_detail', data , options);
//新增大转盘接口
export const addTurn = (data:object={},options:any=false) => fetch('addTurn', data , options);
//获取大转盘列表接口
export const getTurns = (data:object={},options:any=false) => fetch('getTurns', data , options);
//终止大转盘列表接口
export const stopTurn = (data:object={},options:any=false) => fetch('stopTurn', data , options);
//获取大转盘详情
export const getTurn = (data:object={},options:any=false) => fetch('getTurn', data , options);

// 获取商品类目销量、销售额统计
export const systemProdCateSales = (data:object={},options:any=false) => fetch('systemProdCateSales',data,options);
// 商品销量情况统计
export const systemProdSales = (data: object={}, options: any=false) => fetch('systemProdSales', data, options);

//会员增长情况统计
export const systemUserGroupStatistic = (data: object={}, options: any=false) => fetch('systemUserGroupStatistic', data, options);
//会员增长情况统计
export const systemUserFromStatistic = (data: object={}, options: any=false) => fetch('systemUserFromStatistic', data, options);
//会员消费统计
export const systemUserBuyStatistic = (data: object={}, options: any=false) => fetch('systemUserBuyStatistic', data, options);

//订单来源统计
export const systemOrderFromStatistic = (data: object={}, options: any=false) => fetch('systemOrderFromStatistic', data, options);
// 交易数据统计
export const systemSalesStatistic = (data: object={}, options: any=false) => fetch('systemSalesStatistic', data, options);
// 新老客户统计
export const getNewOldTradeStatistic = (data: object={}, options: any=false) => fetch('getNewOldTradeStatistic', data, options);
// 交易数据统计
export const getTradeStatistic = (data: object={}, options: any=false) => fetch('getTradeStatistic', data, options);

// 更新商户配置
export const updateBizConfig = (data: object={}, options: any=false) => fetch('updateBizConfig', data, options);

// 获取商户配置
export const getBizConfig = (data: object={}, options: any=false) => fetch('getBizConfig', data, options);

//新增行业分类
export const addBizIndustry =  (data: object={}, options: any=false) => fetch('addBizIndustry', data, options);

//编辑行业分类
export const editBizIndustry =  (data: object={}, options: any=false) => fetch('editBizIndustry', data, options);

//删除行业分类
export const getBizIndustryDetail =  (data: object={}, options: any=false) => fetch('bizIndustryDetail', data, options);

//获取行业分类
export const bizIndustryList =  (data: object={}, options: any=false) => fetch('bizIndustryList', data, options);






function get_Appid() {
  return 'xhh';
}

export const GET_ACCESS_TOKEN = ()=>Cookie.get('access_token');
export const get_User_ID = () => Cookie.get('Stores_Bind_User_ID');
export const get_Users_ID = () => Cookie.get('Users_ID');
export const get_Stores_ID = () => Cookie.get('Stores_ID');

export const get_Users_Account = () => ls.get('Users_Account')

export const createToken = function (object) {
  object = ObjectToArr(object);
  var signString = ObjectToString(object);
  signString = signString.slice(0, -1);
  var timestamp = parseInt(new Date().getTime() / 1000).toString();
  var key = '458f_$#@$*!fdjisdJDFHUk4%%653154%^@#(FSD#$@0-T';
  var dataStr = signString + key + timestamp;
  // console.log(dataStr)
  var sign = hexMD5(window.Base64.toBase64(dataStr)).toUpperCase();
  object['timestamp'] = timestamp;
  object['sign'] = sign;
  object['sortToken'] = 1;
  return object;
}

//对象转数组，并排序
function ObjectToArr(object, addkey) {
  addkey = addkey || '';
  var arrs = {};
  for (var i in object) {

    var newkey = addkey + (addkey === '' ? i : '[' + i + ']');
    if (typeof object[i] !== 'object') {
      if (object[i] !== '') {
        if (i !== 'timestamp' && i !== 'sign' && i !== 'sortToken') {
          arrs[newkey] = object[i];
        }
      }
    } else {
        ObjectToArr(object[i], newkey);
    }
  }
  var newkey_1 = Object.keys(arrs).sort();
  var newObj = {};//创建一个新的对象，用于存放排好序的键值对

  // 此处不能使用for..in
  newkey_1.forEach(function (val) {
    newObj[val] = arrs[val];//向新创建的对象中按照排好的顺序依次增加键值对
  });
  return newObj;
}

//对象转字符串
function ObjectToString(object, arrs) {
  arrs = arrs || '';
  for (var i in object) {

    if (typeof object[i] !== 'object') {
      if (object[i] !== '') {
        if (i !== 'timestamp' && i !== 'sign') {
          arrs += object[i] + ',';
        }
      }
    } else {
      arrs += ObjectToString(object[i], arrs);
    }
  }
  return arrs;
}
