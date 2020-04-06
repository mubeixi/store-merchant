let {origin} = location
console.log('origin is',origin)
export const staticUrl = process.env.NODE_ENV === 'production'?origin:'https://newo2o.bafangka.com';

export const front_url = process.env.VUE_APP_FRONT_URL;

export const apiKey = '458f_$#@$*!fdjisdJDFHUk4%%653154%^@#(FSD#$@0-T';

export const isDev = process.env.NODE_ENV === 'production' ? false : true;

// console.log('process.env is',process.env)

// if(!isDev && !window.pro_base_apiurl){
//   throw new Error('请配置pro_base_apiurl');
// }

export const baseApiUrl = isDev?'':'';//用绝对路径/api来实现   //process.env.VUE_APP_API_BASE_URL;//'http://www.qiyeban.com';
