export const staticUrl = 'https://new401.bafangka.com';

export const front_url = 'https://new401.bafangka.com/fre/';

export const apiKey = '458f_$#@$*!fdjisdJDFHUk4%%653154%^@#(FSD#$@0-T';

export const isDev = process.env.NODE_ENV === 'production' ? false : true;

console.log('process.env is',process.env)

// if(!isDev && !window.pro_base_apiurl){
//   throw new Error('请配置pro_base_apiurl');
// }

export const baseApiUrl = isDev?'':'https://new401.bafangka.com';//'http://www.qiyeban.com';
